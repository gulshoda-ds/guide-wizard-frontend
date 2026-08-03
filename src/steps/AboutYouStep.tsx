import { Profile } from '../data';
import {
  ATTRIBUTE_SECTIONS,
  AttributeQuestion,
  ViewerAttributes,
  deriveIntersectionalIdentity,
} from '../data/viewerAttributes';

interface AboutYouStepProps {
  profile: Profile;
  onChange: (u: Partial<Profile>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function AboutYouStep({ profile, onChange, onNext, onBack }: AboutYouStepProps) {
  const attrs = profile.viewer_attributes;

  const setAttrs = (u: Partial<ViewerAttributes>) => {
    const next = { ...attrs, ...u };
    next.intersectional_identity = deriveIntersectionalIdentity(next);
    onChange({ viewer_attributes: next });
  };

  const setSingle = (key: AttributeQuestion['key'], value: string) => {
    const current = attrs[key] as string;
    setAttrs({ [key]: current === value ? '' : value } as Partial<ViewerAttributes>);
  };

  const toggleMulti = (key: AttributeQuestion['key'], value: string) => {
    const current = attrs[key] as string[];
    const exclusive = value === 'none' || value === 'no_known_risk' || value === 'not_sure';
    let next: string[];
    if (current.includes(value)) {
      next = current.filter((v) => v !== value);
    } else if (exclusive) {
      next = [value]; // "none"-type answers clear the rest
    } else {
      next = [...current.filter((v) => v !== 'none' && v !== 'no_known_risk' && v !== 'not_sure'), value];
    }
    setAttrs({ [key]: next } as Partial<ViewerAttributes>);
  };

  // Only show faith practice once an affiliation (other than none/skip) is chosen.
  const showQuestion = (q: AttributeQuestion) =>
    q.key !== 'faith_practice' ||
    (attrs.faith_affiliation !== '' &&
      attrs.faith_affiliation !== 'none' &&
      attrs.faith_affiliation !== 'prefer_not_to_say');

  return (
    <div className="max-w-xl mx-auto px-4 pb-10 animate-slide-up">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif', color: '#2d1a0e' }}>
          About you
        </h2>
        <p className="text-sand-600">
          These details personalize your guide's message. Everything is optional — skip anything you like.
        </p>
      </div>

      {ATTRIBUTE_SECTIONS.map((section) => (
        <div key={section.title} className="mb-7 bg-white rounded-3xl border border-sand-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">{section.emoji}</span>
            <h3 className="text-base font-bold text-sand-800" style={{ fontFamily: 'Georgia, serif' }}>
              {section.title}
            </h3>
          </div>

          <div className="space-y-6">
            {section.questions.filter(showQuestion).map((q) => (
              <div key={q.key}>
                <p className="text-sm font-semibold text-sand-700 mb-1">
                  {q.prompt}
                  {q.optional && (
                    <span className="ml-2 text-xs font-normal text-sand-400">(optional)</span>
                  )}
                </p>
                {q.sub && <p className="text-xs text-sand-400 mb-2">{q.sub}</p>}
                {!q.sub && <div className="mb-2" />}
                <div className="flex flex-wrap gap-2">
                  {q.options.map((o) => {
                    const selected = q.multi
                      ? (attrs[q.key] as string[]).includes(o.value)
                      : attrs[q.key] === o.value;
                    return (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() =>
                          q.multi ? toggleMulti(q.key, o.value) : setSingle(q.key, o.value)
                        }
                        className={['chip', selected ? 'chip-selected' : 'chip-unselected'].join(' ')}
                      >
                        {o.emoji && <span>{o.emoji}</span>} {o.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Auto-derived intersectional configuration — read-only transparency */}
      {attrs.intersectional_identity && (
        <div className="mb-8 rounded-2xl border border-teal-100 bg-teal-50 px-5 py-4">
          <div className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-1">
            How your guide will see you at a glance
          </div>
          <div className="text-sm font-medium text-teal-800">
            {attrs.intersectional_identity}
          </div>
          <div className="text-xs text-teal-500 mt-1">
            Built automatically from your answers — nothing extra is asked.
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button onClick={onBack} className="step-btn-ghost">← Back</button>
        <button onClick={onNext} className="step-btn-primary">Continue →</button>
      </div>
    </div>
  );
}
