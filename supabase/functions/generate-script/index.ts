import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// ---------------------------------------------------------------------------
// Types (inline — no shared import in edge runtime)
// ---------------------------------------------------------------------------

interface InstanceFactor {
  class: string;
  value: string;
  relation: string;
  role: "barrier" | "facilitator" | "motivator";
  note?: string;
}

interface InstanceGraph {
  schemaVersion: string;
  viewer: Record<string, string | undefined>;
  intersectionalConfig: string;
  factors: InstanceFactor[];
  clinicalSpine: { disease: string; procedure: string; eligibilityCriterion: string };
  selectedNodeValues: string[];
  createdAt: string;
}

interface CommPrefs {
  persuasionStyle: "evidence" | "community";
  riskDetail: "full" | "simple";
  presentation: "story" | "factual";
  tone: "gentle" | "direct";
}

interface RequestBody {
  instanceGraph: InstanceGraph;
  commPrefs?: CommPrefs;
}

// ---------------------------------------------------------------------------
// Prompt builders
// ---------------------------------------------------------------------------

function describeCommPrefs(p: CommPrefs): string {
  return [
    `  Persuasion style: ${p.persuasionStyle === "evidence" ? "evidence & facts — let her decide" : "community voices & shared experience"}`,
    `  Risk detail: ${p.riskDetail === "full" ? "full detail — she wants to know everything" : "key points only — keep it reassuring and simple"}`,
    `  Presentation: ${p.presentation === "story" ? "narrative / story — use a real woman's experience" : "factual — clear steps and plain explanation"}`,
    `  Tone: ${p.tone === "gentle" ? "gentle — present options, respect her autonomy, no pressure" : "direct — tell her clearly what to do and when"}`,
  ].join("\n");
}

function buildStage1SystemPrompt(commPrefs: CommPrefs): string {
  return `You generate a video/avatar generation prompt for a culturally-tailored breast cancer screening educational video for ONE specific viewer. Ground all content ONLY in this viewer's instance graph (her attributes and the listed factors) plus the clinical spine. Do not introduce factors that are not in her instance graph. Honor each factor's role: address barriers directly, lean on facilitators and motivators as positive anchors. The clinical spine is medical fact and must stay accurate and must not be overridden by any belief factor.

COMMUNICATION STYLE (strictly follow these):
${describeCommPrefs(commPrefs)}

Output only the generation prompt text — no preamble, no explanation, just the prompt.`;
}

function buildStage1UserMessage(instanceGraph: InstanceGraph, commPrefs: CommPrefs): string {
  const roleSummary = instanceGraph.factors.length > 0
    ? instanceGraph.factors
        .map((f) => `- ${f.value} (${f.class}, relation: ${f.relation}, role: ${f.role}${f.note ? ", note: " + f.note : ""})`)
        .join("\n")
    : "No personal factors selected — use the clinical spine only.";

  return `VIEWER INSTANCE GRAPH
=====================
Schema version: ${instanceGraph.schemaVersion}

Viewer attributes:
${Object.entries(instanceGraph.viewer)
  .filter(([, v]) => v && v !== "not specified")
  .map(([k, v]) => `  ${k}: ${v}`)
  .join("\n")}

Intersectional config: ${instanceGraph.intersectionalConfig}

Personal factors (${instanceGraph.factors.length}):
${roleSummary}

Clinical spine (always accurate, never overridden):
  disease: ${instanceGraph.clinicalSpine.disease}
  procedure: ${instanceGraph.clinicalSpine.procedure}
  eligibility: ${instanceGraph.clinicalSpine.eligibilityCriterion}

Communication preferences:
${describeCommPrefs(commPrefs)}

Generate a video generation prompt grounded ONLY in the above instance graph and communication preferences.`;
}

function buildStage2SystemPrompt(commPrefs: CommPrefs): string {
  const toneGuide = commPrefs.tone === "gentle"
    ? "Speak gently. Present options rather than directives. Honour her autonomy — never pressure."
    : "Speak directly and clearly. Tell her exactly what to do and when, in a confident, respectful voice.";

  const formatGuide = commPrefs.presentation === "story"
    ? "Frame it as a short real-woman narrative — weave in her experience or a voice from her community."
    : "Structure it as clear, logical steps — plain facts, no story arc needed.";

  const persuasionGuide = commPrefs.persuasionStyle === "evidence"
    ? "Use specific statistics or evidence-based facts to ground your points."
    : "Draw on community voices, shared experience, and social proof rather than statistics.";

  const riskGuide = commPrefs.riskDetail === "full"
    ? "Include full risk information — she wants to know everything."
    : "Keep risk discussion brief and reassuring — highlight the benefit, minimise dwelling on risk.";

  return `You are the on-screen health guide speaking directly to a viewer. Given the generation prompt, produce the actual spoken script the guide delivers. Keep it accurate, warm, culturally grounded, and specific to this viewer's factors. Address her barriers honestly and briefly. Lean into her motivators and facilitators. Cite the clinical spine facts accurately.

TONE: ${toneGuide}
FORMAT: ${formatGuide}
PERSUASION: ${persuasionGuide}
RISK DETAIL: ${riskGuide}

Write in first-person from the guide's perspective, speaking warmly to "you" (the viewer). Aim for 150–250 words. Output only the spoken script — no stage directions, no preamble.`;
}

// ---------------------------------------------------------------------------
// Claude API call
// ---------------------------------------------------------------------------

async function callClaude(system: string, userMessage: string, apiKey: string): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      system,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Claude API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const block = data.content?.[0];
  if (!block || block.type !== "text") throw new Error("Unexpected Claude response shape");
  return block.text as string;
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

const DEFAULT_COMM_PREFS: CommPrefs = {
  persuasionStyle: "evidence",
  riskDetail: "simple",
  presentation: "story",
  tone: "gentle",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY is not configured" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON body" }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  const { instanceGraph, commPrefs = DEFAULT_COMM_PREFS } = body;
  if (!instanceGraph) {
    return new Response(
      JSON.stringify({ error: "instanceGraph is required" }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  try {
    const stage1Prompt = await callClaude(
      buildStage1SystemPrompt(commPrefs),
      buildStage1UserMessage(instanceGraph, commPrefs),
      apiKey
    );

    const stage2Message = await callClaude(
      buildStage2SystemPrompt(commPrefs),
      `GENERATION PROMPT:\n${stage1Prompt}\n\nINSTANCE GRAPH SELECTED NODES: ${instanceGraph.selectedNodeValues.join(", ") || "none"}`,
      apiKey
    );

    const groundedNodeValues = instanceGraph.selectedNodeValues.filter((v) =>
      stage2Message.toLowerCase().includes(v.toLowerCase().split(" ")[0])
    );

    return new Response(
      JSON.stringify({ stage1Prompt, stage2Message, groundedNodeValues }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Generation failed" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
