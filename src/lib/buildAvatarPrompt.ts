// Prompt assembly for the Portrait Prompt Builder (AvatarCreate).
//
// The communication style is a 2×2 grid — convincing approach (evidence vs.
// experiences) × tone (reassure vs. direct) — the two validated axes from the
// comstyle experiments. Each quadrant gets its own script prompt; the image
// prompt is identical for all quadrants.

export type ConvincingApproach = 'evidence' | 'experiences';
export type Tone = 'reassure' | 'direct';

export interface StyleSelection {
  convincing_approach: ConvincingApproach;
  tone: Tone;
}

// Hidden internal pathway values for knowledge-graph mapping (never shown to
// the user) — see bolt-prompt-add-pathways.md.
const APPROACH_PATHWAY: Record<ConvincingApproach, string> = {
  evidence: 'elm_central',
  experiences: 'elm_peripheral',
};
const TONE_PATHWAY: Record<Tone, string> = {
  reassure: 'supportive',
  direct: 'directive',
};

export const quadrantKey = (s: StyleSelection): string =>
  `${s.convincing_approach}_${s.tone}`;

// ── Image prompt (constant across quadrants) ─────────────────────────────────

export const IMAGE_PROMPT_ID = 'portrait_health_guide_v1';

export const IMAGE_PROMPT = `Portrait of a middle-aged African American woman health educator, warm brown skin, natural hair, wearing professional but approachable attire.
She is looking directly at the camera with a gentle, confident expression, head-and-shoulders framing.
Soft natural lighting, clean simple background, photorealistic, 1:1 aspect ratio.
She should feel like a trusted community health guide — warm, credible, and present.`;

// ── Script prompt per quadrant ───────────────────────────────────────────────

const BASE_TASK = `You are writing the spoken script for a short (60–90 second) breast cancer screening education video.
The speaker is the woman in the portrait: a trusted community health educator talking one-on-one with a woman from her own community who is due for a mammogram.
Keep it medically accurate: breast cancer, mammogram, screening recommended for ages 40/50–74.
Plain, warm, spoken language — no medical jargon, no bullet points, no stage directions. Output only the spoken script.`;

const APPROACH_BLOCK: Record<ConvincingApproach, string> = {
  evidence: `CONVINCING APPROACH — EVIDENCE (central route):
- Persuade with facts, numbers, and sources: screening rates, survival statistics when caught early, how the procedure works.
- Cite where the numbers come from in plain language ("doctors have found", "studies show").
- Do NOT use personal anecdotes or testimonials as the persuasive engine — the data carries the message.`,
  experiences: `CONVINCING APPROACH — EXPERIENCES (peripheral route):
- Persuade through lived experience: a story of a woman like the viewer who went, what it was like, how she felt after.
- Lean on relatable voices ("my sister", "a woman at my church") and social proof from the community.
- Do NOT recite statistics or cite studies — at most one simple fact, carried inside the story.`,
};

const TONE_BLOCK: Record<Tone, string> = {
  reassure: `TONE — REASSURING (supportive register):
- Validate feelings BEFORE facts: name the fear or nervousness as normal and understandable.
- Use at least 3 reassurance phrases ("you're not alone", "it's okay", "we'll walk through it together").
- Use accompaniment language — the guide is beside her, not lecturing her.
- Close with a gentle invitation, not a command.`,
  direct: `TONE — DIRECT (directive register):
- Put the recommendation in the FIRST sentence.
- Use short sentences and at least 4 imperatives ("call", "book", "ask", "go").
- No validation language, no dwelling on feelings — respectful, but businesslike.
- Close with one concrete step and a timeline ("call this week").`,
};

export const buildScriptPrompt = (s: StyleSelection): string =>
  [BASE_TASK, APPROACH_BLOCK[s.convincing_approach], TONE_BLOCK[s.tone]].join('\n\n');

// ── Gemini text API request body ─────────────────────────────────────────────

export const buildScriptRequestBody = (s: StyleSelection): object => ({
  contents: [
    {
      role: 'user',
      parts: [{ text: buildScriptPrompt(s) }],
    },
  ],
  generationConfig: {
    temperature: 0.8,
    maxOutputTokens: 1024,
  },
});

// ── Data export (style keys + image prompt id, assemble at call time) ────────

export const buildDataExport = (s: StyleSelection): object => ({
  image_prompt_id: IMAGE_PROMPT_ID,
  quadrant: quadrantKey(s),
  communication_style: {
    convincing: APPROACH_PATHWAY[s.convincing_approach],
    tone: TONE_PATHWAY[s.tone],
  },
});
