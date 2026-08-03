import { useState } from "react";
import {
  Sun, Wind, User, Eye, MapPin, Glasses, FileText, Clipboard, Check, ArrowLeft, RotateCcw, MessageCircle,
} from "lucide-react";
import { AvatarSpec } from "../types/avatar";
import {
  IMAGE_PROMPT,
  buildScriptPrompt,
  buildScriptRequestBody,
  buildDataExport,
  quadrantKey,
  type StyleSelection,
} from "../lib/buildAvatarPrompt";

// ---------------------------------------------------------------------------
// Option data
// ---------------------------------------------------------------------------

const SKIN_TONES: { value: AvatarSpec["skin_tone"]; label: string }[] = [
  { value: "medium_brown",  label: "Medium brown, warm undertones" },
  { value: "warm_dark",     label: "Warm dark brown with golden undertones" },
  { value: "deep",          label: "Deep dark brown with cool undertones" },
  { value: "rich_dark",     label: "The richest dark brown" },
];

const AGE_BANDS: { value: AvatarSpec["age_band"]; label: string }[] = [
  { value: "40_49",   label: "Mid 40s" },
  { value: "50_59",   label: "Mid 50s" },
  { value: "60_69",   label: "Mid 60s" },
  { value: "70_plus", label: "70s and beyond" },
];

const HAIR_OPTIONS: { value: AvatarSpec["hair_or_covering"]; label: string }[] = [
  { value: "natural_afro", label: "Natural afro" },
  { value: "twist_out",    label: "Twist-out" },
  { value: "locs",         label: "Locs" },
  { value: "box_braids",   label: "Box braids" },
  { value: "cornrows",     label: "Cornrows" },
  { value: "silk_press",   label: "Silk press" },
];

const COVERING_OPTIONS: { value: AvatarSpec["hair_or_covering"]; label: string }[] = [
  { value: "hijab_navy",          label: "Navy hijab" },
  { value: "hijab_burgundy",      label: "Burgundy hijab" },
  { value: "hijab_cream",         label: "Cream hijab" },
  { value: "ankara_headwrap",     label: "Ankara headwrap" },
  { value: "senegalese_headwrap", label: "Senegalese headwrap" },
];

const DEMEANOR_OPTIONS: { value: AvatarSpec["demeanor"]; label: string }[] = [
  { value: "warm_smile",    label: "Warm smile" },
  { value: "thoughtful",    label: "Thoughtful" },
  { value: "calm_centered", label: "Calm and centered" },
];

const SETTING_OPTIONS: { value: AvatarSpec["setting"]; label: string }[] = [
  { value: "neutral",           label: "Neutral studio backdrop" },
  { value: "home_window_light", label: "At home, soft window light" },
  { value: "outdoor_natural",   label: "Outdoors, natural light" },
];

const GLASSES_OPTIONS: { value: AvatarSpec["wears_glasses"]; label: string }[] = [
  { value: "none",             label: "No" },
  { value: "reading_glasses",  label: "Sometimes — reading glasses" },
  { value: "everyday_glasses", label: "Yes, I wear them every day" },
];

// ---------------------------------------------------------------------------
// Communication-style pathway types and question data
// ---------------------------------------------------------------------------

type PartialStyle = Partial<StyleSelection>;

const COMM_QUESTIONS: {
  key: keyof StyleSelection;
  question: string;
  options: { value: string; label: string }[];
}[] = [
  {
    key: "convincing_approach",
    question: "How do you like to be convinced?",
    options: [
      { value: "evidence",    label: "Show me the evidence and the numbers" },
      { value: "experiences", label: "I trust people's experiences, not statistics" },
    ],
  },
  {
    key: "tone",
    question: "How should the message feel?",
    options: [
      { value: "reassure", label: "Reassure me — tell me it'll be okay" },
      { value: "direct",   label: "Be direct — just tell me how it is" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Shared radio card component
// ---------------------------------------------------------------------------

function RadioCard<T extends string>({
  options,
  selected,
  onSelect,
  cols = 2,
}: {
  options: { value: T; label: string }[];
  selected: T | undefined;
  onSelect: (v: T) => void;
  cols?: number;
}) {
  const gridClass =
    cols === 3
      ? "grid grid-cols-1 sm:grid-cols-3 gap-3"
      : cols === 4
      ? "grid grid-cols-2 sm:grid-cols-4 gap-3"
      : "grid grid-cols-1 sm:grid-cols-2 gap-3";

  return (
    <div role="radiogroup" className={gridClass}>
      {options.map((opt) => {
        const isSelected = selected === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(opt.value)}
            className={[
              "px-4 py-3 rounded-xl border-2 text-left text-sm font-medium transition-all duration-150",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-700 focus-visible:ring-offset-1",
              isSelected
                ? "border-rose-700 bg-rose-50 text-rose-900 shadow-sm"
                : "border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50",
            ].join(" ")}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section header
// ---------------------------------------------------------------------------

function SectionHeader({
  icon,
  label,
  required,
  filled,
}: {
  icon: React.ReactNode;
  label: string;
  required?: boolean;
  filled?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className={filled ? "text-emerald-700" : "text-stone-400"}>{icon}</span>
      <h2 className="text-base font-semibold text-stone-800">{label}</h2>
      {required && !filled && (
        <span className="ml-auto text-xs text-stone-400 font-normal">Required</span>
      )}
      {filled && (
        <span className="ml-auto text-xs text-emerald-700 font-medium">✓</span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Copy button
// ---------------------------------------------------------------------------

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const handleClick = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={handleClick}
      className={[
        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150",
        copied
          ? "bg-emerald-700 text-white"
          : "bg-rose-800 hover:bg-rose-900 text-white",
      ].join(" ")}
    >
      {copied ? <Check size={15} /> : <Clipboard size={15} />}
      {copied ? "Copied!" : label ?? "Copy"}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Result view
// ---------------------------------------------------------------------------

function ResultView({
  style,
  onEdit,
  onReset,
}: {
  style: StyleSelection;
  onEdit: () => void;
  onReset: () => void;
}) {
  const scriptPrompt = buildScriptPrompt(style);
  const scriptRequestBody = buildScriptRequestBody(style);
  const dataExport = buildDataExport(style);
  const qKey = quadrantKey(style);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 animate-fade-in">
      {/* Success header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mb-4">
          <Check size={24} />
        </div>
        <h1
          className="text-2xl font-bold text-stone-900 mb-2"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Your prompts are ready.
        </h1>
        <p className="text-stone-600 text-sm">
          Two separate prompts for two separate models. Copy each one.
        </p>
      </div>

      {/* Instruction note */}
      <div className="bg-stone-100 rounded-xl px-5 py-4 mb-8 text-sm text-stone-600 leading-relaxed">
        <p>
          <span className="font-semibold text-stone-800">Script prompt</span> → paste into your text model
          (e.g. Gemini Flash), or use the API request body JSON below for a direct call. Each of the four quadrants gets its own script prompt.
        </p>
      </div>

      {/* Quadrant label */}
      <div className="mb-6 flex items-center gap-2">
        <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Quadrant</span>
        <code className="text-xs font-mono bg-rose-50 text-rose-700 px-2.5 py-1 rounded-full border border-rose-100">
          {qKey}
        </code>
      </div>

      {/* Block A — Image prompt */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden mb-5 shadow-sm">
        <div className="flex items-start justify-between px-5 py-4 border-b border-stone-100">
          <div>
            <div className="text-sm font-semibold text-stone-800">
              Image prompt
            </div>
            <div className="text-xs text-stone-400 mt-0.5">
              For image generation — identical for all quadrants
            </div>
          </div>
          <CopyButton text={IMAGE_PROMPT} label="Copy image prompt" />
        </div>
        <div className="px-5 py-5 overflow-auto max-h-96">
          <pre className="text-xs text-stone-700 whitespace-pre-wrap leading-relaxed font-mono">
            {IMAGE_PROMPT}
          </pre>
        </div>
      </div>

      {/* Block B — Script API request body */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden mb-5 shadow-sm">
        <div className="flex items-start justify-between px-5 py-4 border-b border-stone-100">
          <div>
            <div className="text-sm font-semibold text-stone-800">
              Script API request body — {qKey}
            </div>
            <div className="text-xs text-stone-400 mt-0.5">
              For a direct Gemini text API call
            </div>
          </div>
          <CopyButton
            text={JSON.stringify(scriptRequestBody, null, 2)}
            label="Copy JSON"
          />
        </div>
        <div className="px-5 py-5 overflow-auto max-h-64">
          <pre className="text-xs text-stone-700 whitespace-pre-wrap leading-relaxed font-mono">
            {JSON.stringify(scriptRequestBody, null, 2)}
          </pre>
        </div>
      </div>

      {/* Block C — Script prompt */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden mb-5 shadow-sm">
        <div className="flex items-start justify-between px-5 py-4 border-b border-stone-100">
          <div>
            <div className="text-sm font-semibold text-stone-800">
              Script prompt — {qKey}
            </div>
            <div className="text-xs text-stone-400 mt-0.5">
              For text generation — send to your text model
            </div>
          </div>
          <CopyButton text={scriptPrompt} label="Copy script prompt" />
        </div>
        <div className="px-5 py-5 overflow-auto max-h-96">
          <pre className="text-xs text-stone-700 whitespace-pre-wrap leading-relaxed font-mono">
            {scriptPrompt}
          </pre>
        </div>
      </div>

      {/* Block D — Data export JSON */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden mb-8 shadow-sm">
        <div className="flex items-start justify-between px-5 py-4 border-b border-stone-100">
          <div>
            <div className="text-sm font-semibold text-stone-800">
              Data export
            </div>
            <div className="text-xs text-stone-400 mt-0.5">
              Style keys + image prompt ID — assemble prompts at call time
            </div>
          </div>
          <CopyButton text={JSON.stringify(dataExport, null, 2)} label="Copy JSON" />
        </div>
        <div className="px-5 py-5 overflow-auto max-h-64">
          <pre className="text-xs text-stone-700 whitespace-pre-wrap leading-relaxed font-mono">
            {JSON.stringify(dataExport, null, 2)}
          </pre>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="flex gap-3 justify-center">
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-2 px-5 py-3 rounded-full border-2 border-stone-300 text-stone-700 font-semibold text-sm hover:bg-stone-50 hover:border-stone-400 transition-colors"
        >
          <ArrowLeft size={15} />
          Edit my choices
        </button>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-2 px-5 py-3 rounded-full border-2 border-rose-200 text-rose-800 font-semibold text-sm hover:bg-rose-50 hover:border-rose-300 transition-colors"
        >
          <RotateCcw size={15} />
          Start over
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Form view
// ---------------------------------------------------------------------------

// hair_style is the required field; head_covering is optional (overrides hair_style in the prompt)
type FormState = Partial<AvatarSpec> & {
  hair_style?: AvatarSpec["hair_or_covering"];
  head_covering?: AvatarSpec["hair_or_covering"];
  style?: PartialStyle;
};

const IDENTITY_REQUIRED_FIELDS: (keyof FormState)[] = [
  "skin_tone",
  "age_band",
  "hair_style",
  "demeanor",
  "setting",
];

function styleComplete(s: PartialStyle | undefined): s is StyleSelection {
  return !!(s?.convincing_approach && s?.tone);
}

// hair_or_covering resolution: head_covering (when set) overrides hair_style.
export function formStateToSpec(form: FormState): Partial<AvatarSpec> {
  const { hair_style, head_covering, style: _s, ...rest } = form;
  return {
    ...rest,
    hair_or_covering: head_covering ?? hair_style,
  };
}

function FormView({
  form,
  onChange,
  onGenerate,
}: {
  form: FormState;
  onChange: (updates: Partial<FormState>) => void;
  onGenerate: () => void;
}) {
  const identityCount = IDENTITY_REQUIRED_FIELDS.filter((f) => form[f]).length;
  const sComplete = styleComplete(form.style);
  const completedCount = identityCount + (sComplete ? 1 : 0);
  const canGenerate = completedCount === 6;
  const remaining = 6 - completedCount;

  const notesLen = form.additional_notes?.length ?? 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Page header */}
      <div className="mb-10">
        <h1
          className="text-3xl font-bold text-stone-900 mb-2 leading-snug"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Create the woman in your storyboard.
        </h1>
        <p className="text-stone-500 text-sm">
          Your choices stay on this device — nothing is sent anywhere.
        </p>
      </div>

      {/* Skin tone */}
      <section className="mb-8">
        <SectionHeader
          icon={<Sun size={18} />}
          label="What's your skin tone?"
          required
          filled={!!form.skin_tone}
        />
        <RadioCard
          options={SKIN_TONES}
          selected={form.skin_tone}
          onSelect={(v) => onChange({ skin_tone: v })}
          cols={2}
        />
      </section>

      {/* Age range */}
      <section className="mb-8">
        <SectionHeader
          icon={<User size={18} />}
          label="What's your age range?"
          required
          filled={!!form.age_band}
        />
        <RadioCard
          options={AGE_BANDS}
          selected={form.age_band}
          onSelect={(v) => onChange({ age_band: v })}
          cols={4}
        />
      </section>

      {/* Hair — required */}
      <section className="mb-8">
        <SectionHeader
          icon={<Wind size={18} />}
          label="How do you wear your hair?"
          required
          filled={!!form.hair_style}
        />
        <RadioCard
          options={HAIR_OPTIONS}
          selected={form.hair_style}
          onSelect={(v) => onChange({ hair_style: v })}
          cols={2}
        />

        {/* Head covering — optional override */}
        <div className="mt-5 pt-5 border-t border-stone-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                Head covering{" "}
                <span className="text-stone-300 normal-case font-normal tracking-normal">
                  — optional, replaces hair above
                </span>
              </p>
              <p className="text-xs text-stone-400 mt-0.5">
                Choose this if you wear a covering. Leave it blank to show your hair instead.
              </p>
            </div>
            {form.head_covering && (
              <button
                type="button"
                onClick={() => onChange({ head_covering: undefined })}
                className="flex-shrink-0 text-xs text-stone-400 hover:text-rose-600 transition-colors underline underline-offset-2 ml-3"
              >
                Remove
              </button>
            )}
          </div>
          <RadioCard
            options={COVERING_OPTIONS}
            selected={form.head_covering}
            onSelect={(v) => onChange({ head_covering: v })}
            cols={2}
          />
        </div>
      </section>

      {/* Expression */}
      <section className="mb-8">
        <SectionHeader
          icon={<Eye size={18} />}
          label="Pick an expression"
          required
          filled={!!form.demeanor}
        />
        <RadioCard
          options={DEMEANOR_OPTIONS}
          selected={form.demeanor}
          onSelect={(v) => onChange({ demeanor: v })}
          cols={3}
        />
      </section>

      {/* Setting */}
      <section className="mb-8">
        <SectionHeader
          icon={<MapPin size={18} />}
          label="Pick a setting"
          required
          filled={!!form.setting}
        />
        <RadioCard
          options={SETTING_OPTIONS}
          selected={form.setting}
          onSelect={(v) => onChange({ setting: v })}
          cols={3}
        />
      </section>

      {/* Glasses — personalization extra */}
      <div className="border-t border-stone-100 pt-8 mb-8">
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-5">
          Personalization extras
        </p>
        <section className="mb-8">
          <SectionHeader
            icon={<Glasses size={18} />}
            label="Do you wear glasses?"
            filled={!!form.wears_glasses}
          />
          <RadioCard
            options={GLASSES_OPTIONS}
            selected={form.wears_glasses}
            onSelect={(v) => onChange({ wears_glasses: v })}
            cols={3}
          />
        </section>

        {/* Additional notes */}
        <section className="mb-8">
          <SectionHeader
            icon={<FileText size={18} />}
            label="Anything else?"
            filled={!!(form.additional_notes && form.additional_notes.trim())}
          />
          <p className="text-xs text-stone-400 mb-3">
            e.g. a small gold cross necklace, hands clasped in her lap
          </p>
          <div className="relative">
            <textarea
              value={form.additional_notes ?? ""}
              onChange={(e) => {
                const val = e.target.value.slice(0, 200);
                onChange({ additional_notes: val });
              }}
              placeholder="e.g. a small gold cross necklace, hands clasped in her lap"
              rows={3}
              maxLength={200}
              className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 bg-white text-stone-800 text-sm placeholder-stone-300 focus:outline-none focus:border-rose-600 resize-none transition-colors"
            />
            <span
              className={[
                "absolute bottom-3 right-3 text-xs",
                notesLen >= 180 ? "text-rose-500" : "text-stone-300",
              ].join(" ")}
            >
              {notesLen}/200
            </span>
          </div>
        </section>
      </div>

      {/* Communication style */}
      <div className="border-t border-stone-100 pt-8 mb-8">
        <SectionHeader
          icon={<MessageCircle size={18} />}
          label="How you like to be talked to"
          required
          filled={sComplete}
        />
        <p className="text-xs text-stone-400 mb-5">
          These shape how the health message is delivered to you. Both are required.
        </p>
        <div className="space-y-6">
          {COMM_QUESTIONS.map((q) => (
            <div key={String(q.key)}>
              <p className="text-xs font-semibold text-stone-500 mb-2">{q.question}</p>
              <RadioCard
                options={q.options as { value: string; label: string }[]}
                selected={form.style?.[q.key]}
                onSelect={(v) =>
                  onChange({ style: { ...form.style, [q.key]: v } })
                }
                cols={2}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Completion summary + button */}
      <div className="bg-stone-50 rounded-2xl border border-stone-200 px-5 py-5">
        <div className="flex items-center justify-between mb-4">
          <p
            className={[
              "text-sm font-semibold",
              canGenerate ? "text-emerald-700" : "text-stone-500",
            ].join(" ")}
          >
            {canGenerate
              ? "All sections complete"
              : remaining === 1
              ? "1 section still to go"
              : `${remaining} sections still to go`}
          </p>
          <div className="flex gap-1">
            {IDENTITY_REQUIRED_FIELDS.map((f) => (
              <div
                key={f}
                className={[
                  "w-2 h-2 rounded-full transition-colors",
                  form[f] ? "bg-emerald-600" : "bg-stone-200",
                ].join(" ")}
              />
            ))}
            <div
              className={[
                "w-2 h-2 rounded-full transition-colors",
                sComplete ? "bg-emerald-600" : "bg-stone-200",
              ].join(" ")}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={onGenerate}
          disabled={!canGenerate}
          className={[
            "w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-150",
            canGenerate
              ? "bg-rose-800 hover:bg-rose-900 text-white shadow-sm hover:shadow-md"
              : "bg-stone-100 text-stone-400 cursor-not-allowed",
          ].join(" ")}
        >
          Generate my prompts
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page root
// ---------------------------------------------------------------------------

export default function AvatarCreate({ onBack }: { onBack?: () => void }) {
  const [form, setForm] = useState<FormState>({
    wears_glasses: "none",
  });
  const [result, setResult] = useState<boolean>(false);

  const handleChange = (updates: Partial<FormState>) => {
    setForm((prev) => ({ ...prev, ...updates }));
  };

  const handleGenerate = () => {
    setResult(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEdit = () => {
    setResult(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // "Start over" clears the form and stays here — leaving is the nav button's job.
  const handleReset = () => {
    setForm({ wears_glasses: "none" });
    setResult(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const style = form.style as StyleSelection;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#faf8f5" }}>
      {/* Warm top strip */}
      <div className="h-1 w-full bg-gradient-to-r from-rose-800 via-rose-600 to-amber-500" />

      {/* Back-to-wizard nav */}
      {onBack && (
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-stone-100 shadow-sm">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 transition-colors font-medium"
            >
              <ArrowLeft size={15} /> Back to guide
            </button>
            <span className="text-stone-200">|</span>
            <span className="text-sm font-semibold text-stone-700" style={{ fontFamily: "Georgia, serif" }}>
              Portrait Prompt Builder
            </span>
          </div>
        </div>
      )}

      {result ? (
        <ResultView
          style={style}
          onEdit={handleEdit}
          onReset={handleReset}
        />
      ) : (
        <FormView form={form} onChange={handleChange} onGenerate={handleGenerate} />
      )}
    </div>
  );
}
