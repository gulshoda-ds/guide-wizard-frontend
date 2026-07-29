
import { Profile, PERSONAS, VIBES } from '../data';

interface PersonalityStepProps {
  profile: Profile;
  onChange: (u: Partial<Profile>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function PersonalityStep({ profile, onChange, onNext, onBack }: PersonalityStepProps) {
  const canContinue = !!(profile.guide_persona && profile.guide_vibe);

  return (
    <div className="max-w-xl mx-auto px-4 pb-10 animate-slide-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif', color: '#2d1a0e' }}>
          Your guide's personality
        </h2>
        <p className="text-sand-600">Who do you want standing in your corner?</p>
      </div>

      {/* Persona */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-sand-700 mb-3">Who do you want your guide to feel like?</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PERSONAS.map((p) => {
            const selected = profile.guide_persona === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onChange({ guide_persona: p.id })}
                className={[
                  'text-left p-4 rounded-2xl border-2 transition-all duration-200',
                  selected
                    ? 'border-coral-500 bg-coral-50 shadow-md'
                    : 'border-sand-200 bg-white hover:border-coral-300 hover:bg-coral-50 hover:-translate-y-0.5 hover:shadow-sm',
                ].join(' ')}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5 flex-shrink-0">{p.emoji}</span>
                  <div>
                    <div className={['font-semibold text-sm', selected ? 'text-coral-700' : 'text-sand-800'].join(' ')}>
                      {p.label}
                    </div>
                    <div className="text-xs text-sand-500 mt-0.5 leading-relaxed">{p.desc}</div>
                  </div>
                  {selected && (
                    <span className="ml-auto flex-shrink-0 w-5 h-5 bg-coral-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Vibe */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-sand-700 mb-3">What's their energy?</p>
        <div className="grid grid-cols-2 gap-3">
          {VIBES.map((v) => {
            const selected = profile.guide_vibe === v.id;
            return (
              <button
                key={v.id}
                onClick={() => onChange({ guide_vibe: v.id })}
                className={[
                  'p-4 rounded-2xl border-2 text-center transition-all duration-200',
                  selected
                    ? 'border-coral-500 bg-gradient-to-br ' + v.color + ' shadow-md'
                    : 'border-sand-200 bg-white hover:border-coral-300 hover:-translate-y-0.5 hover:shadow-sm',
                ].join(' ')}
              >
                <div className="text-3xl mb-2">{v.emoji}</div>
                <div className={['text-sm font-semibold', selected ? 'text-coral-700' : 'text-sand-700'].join(' ')}>
                  {v.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="step-btn-ghost">← Back</button>
        <button
          onClick={onNext}
          disabled={!canContinue}
          className={['step-btn-primary', !canContinue ? 'opacity-50 cursor-not-allowed' : ''].join(' ')}
        >
          Looking good →
        </button>
      </div>
    </div>
  );
}
