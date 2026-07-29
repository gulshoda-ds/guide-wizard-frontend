
import { Profile, SCENES, ART_STYLES } from '../data';
import LiveAvatar from '../LiveAvatar';

interface SceneStepProps {
  profile: Profile;
  onChange: (u: Partial<Profile>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function SceneStep({ profile, onChange, onNext, onBack }: SceneStepProps) {
  const canContinue = !!(profile.scene && profile.art_style);

  return (
    <div className="max-w-xl mx-auto px-4 pb-10 animate-slide-up">
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 text-center">
          <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif', color: '#2d1a0e' }}>
            Set the scene
          </h2>
          <p className="text-sand-600">Where does your guide meet you? And how should they look?</p>
        </div>
        <LiveAvatar profile={profile} size="md" />
      </div>

      {/* Scene */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-sand-700 mb-3">Setting</p>
        <div className="grid grid-cols-1 gap-2">
          {SCENES.map((s) => {
            const selected = profile.scene === s.id;
            return (
              <button
                key={s.id}
                onClick={() => onChange({ scene: s.id })}
                className={[
                  'flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all duration-200 text-left',
                  selected
                    ? 'border-coral-500 bg-coral-50 shadow-sm'
                    : 'border-sand-200 bg-white hover:border-coral-300 hover:bg-coral-50 hover:-translate-y-0.5',
                ].join(' ')}
              >
                <span className="text-2xl flex-shrink-0">{s.emoji}</span>
                <div className="flex-1">
                  <div className={['text-sm font-semibold', selected ? 'text-coral-700' : 'text-sand-800'].join(' ')}>{s.label}</div>
                  <div className="text-xs text-sand-400">{s.desc}</div>
                </div>
                {selected && <span className="text-coral-500 text-sm flex-shrink-0">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Art style */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-sand-700 mb-3">Visual style</p>
        <div className="grid grid-cols-2 gap-3">
          {ART_STYLES.map((a) => {
            const selected = profile.art_style === a.id;
            return (
              <button
                key={a.id}
                onClick={() => onChange({ art_style: a.id })}
                className={[
                  'flex flex-col items-center gap-2 py-4 px-3 rounded-2xl border-2 transition-all duration-200 text-center',
                  selected
                    ? 'border-coral-500 bg-coral-50 shadow-md'
                    : 'border-sand-200 bg-white hover:border-coral-300 hover:-translate-y-0.5 hover:shadow-sm',
                ].join(' ')}
              >
                <span className="text-3xl">{a.emoji}</span>
                <div>
                  <div className={['text-sm font-semibold', selected ? 'text-coral-700' : 'text-sand-800'].join(' ')}>{a.label}</div>
                  <div className="text-xs text-sand-400 mt-0.5">{a.desc}</div>
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
          Almost there →
        </button>
      </div>
    </div>
  );
}
