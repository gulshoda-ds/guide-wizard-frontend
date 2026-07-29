
import { Profile, LOOK_AGES, LOOK_GENDERS, SKIN_TONES, HAIR_STYLES, ATTIRE_STYLES } from '../data';
import LiveAvatar from '../LiveAvatar';

interface LookStepProps {
  profile: Profile;
  onChange: (u: Partial<Profile>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function LookStep({ profile, onChange, onNext, onBack }: LookStepProps) {
  const canContinue = !!(profile.look_skin && profile.look_hair && profile.look_attire);

  return (
    <div className="max-w-xl mx-auto px-4 pb-10 animate-slide-up">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif', color: '#2d1a0e' }}>
          Design their look
        </h2>
        <p className="text-sand-600">Every choice you make shapes how your guide appears.</p>
      </div>

      {/* Live avatar preview — floats and updates in real time */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="w-36 h-36 rounded-full bg-gradient-to-br from-coral-50 to-teal-50 border-2 border-sand-200 flex items-center justify-center shadow-inner overflow-hidden">
            <LiveAvatar profile={profile} size="lg" />
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white rounded-full px-3 py-1 shadow border border-sand-100 text-xs text-sand-500 whitespace-nowrap">
            {profile.look_skin ? 'Looking great!' : 'Pick options to build your guide'}
          </div>
        </div>
      </div>

      {/* Age feel */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-sand-700 mb-2">Age feel</p>
        <div className="flex gap-3">
          {LOOK_AGES.map((a) => {
            const selected = profile.look_age === a.id;
            return (
              <button
                key={a.id}
                onClick={() => onChange({ look_age: a.id })}
                className={[
                  'flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-2xl border-2 transition-all duration-200 text-center',
                  selected
                    ? 'border-coral-500 bg-coral-50 shadow-sm'
                    : 'border-sand-200 bg-white hover:border-coral-300 hover:bg-coral-50',
                ].join(' ')}
              >
                <span className="text-xl">{a.emoji}</span>
                <span className={['text-xs font-semibold', selected ? 'text-coral-700' : 'text-sand-700'].join(' ')}>{a.label}</span>
                <span className="text-xs text-sand-400">{a.sub}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Gender presentation */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-sand-700 mb-2">Presentation</p>
        <div className="flex gap-3">
          {LOOK_GENDERS.map((g) => {
            const selected = profile.look_gender === g.id;
            return (
              <button
                key={g.id}
                onClick={() => onChange({ look_gender: g.id })}
                className={[
                  'flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-2xl border-2 transition-all duration-200',
                  selected
                    ? 'border-coral-500 bg-coral-50 shadow-sm'
                    : 'border-sand-200 bg-white hover:border-coral-300 hover:bg-coral-50',
                ].join(' ')}
              >
                <span className="text-xl">{g.emoji}</span>
                <span className={['text-sm font-semibold', selected ? 'text-coral-700' : 'text-sand-700'].join(' ')}>{g.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Skin tone swatches */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-sand-700 mb-1">Skin tone</p>
        <p className="text-xs text-sand-400 mb-3">Pick the look that feels right for your guide — this is your design choice.</p>
        <div className="flex gap-3 flex-wrap">
          {SKIN_TONES.map((s) => {
            const selected = profile.look_skin === s.id;
            return (
              <button
                key={s.id}
                title={s.label}
                onClick={() => onChange({ look_skin: s.id })}
                className={[
                  'flex flex-col items-center gap-1.5 transition-all duration-200',
                  selected ? 'scale-110' : 'hover:scale-105',
                ].join(' ')}
              >
                <div
                  className={[
                    'w-10 h-10 rounded-full border-2 shadow-sm transition-all duration-200',
                    selected ? 'border-coral-500 shadow-md ring-2 ring-coral-300' : 'border-white hover:border-coral-300',
                  ].join(' ')}
                  style={{ backgroundColor: s.hex }}
                />
                <span className={['text-xs', selected ? 'font-semibold text-coral-600' : 'text-sand-500'].join(' ')}>
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hair style */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-sand-700 mb-2">Hair</p>
        <div className="grid grid-cols-3 gap-2">
          {HAIR_STYLES.map((h) => {
            const selected = profile.look_hair === h.id;
            return (
              <button
                key={h.id}
                onClick={() => onChange({ look_hair: h.id })}
                className={[
                  'flex flex-col items-center gap-1 py-3 px-2 rounded-2xl border-2 transition-all duration-200',
                  selected
                    ? 'border-coral-500 bg-coral-50 shadow-sm'
                    : 'border-sand-200 bg-white hover:border-coral-300 hover:bg-coral-50',
                ].join(' ')}
              >
                <span className="text-xl">{h.emoji}</span>
                <span className={['text-xs font-semibold', selected ? 'text-coral-700' : 'text-sand-700'].join(' ')}>{h.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Attire */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-sand-700 mb-2">Style of dress</p>
        <div className="grid grid-cols-1 gap-2">
          {ATTIRE_STYLES.map((a) => {
            const selected = profile.look_attire === a.id;
            return (
              <button
                key={a.id}
                onClick={() => onChange({ look_attire: a.id })}
                className={[
                  'flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all duration-200',
                  selected
                    ? 'border-coral-500 bg-coral-50 shadow-sm'
                    : 'border-sand-200 bg-white hover:border-coral-300 hover:bg-coral-50',
                ].join(' ')}
              >
                <span
                  className="w-4 h-4 rounded-full flex-shrink-0 border border-white shadow-sm"
                  style={{ backgroundColor: a.color }}
                />
                <span className="text-xl flex-shrink-0">{a.emoji}</span>
                <span className={['text-sm font-semibold', selected ? 'text-coral-700' : 'text-sand-700'].join(' ')}>{a.label}</span>
                {selected && <span className="ml-auto text-coral-500 text-sm">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cultural touches — optional free text */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-sand-700 mb-1">
          Anything you'd like your guide to wear or show?{' '}
          <span className="font-normal text-sand-400">(optional)</span>
        </p>
        <p className="text-xs text-sand-400 mb-2">Jewelry, head covering, specific colors, cultural dress details…</p>
        <input
          type="text"
          value={profile.look_cultural_touches}
          onChange={(e) => onChange({ look_cultural_touches: e.target.value })}
          placeholder="e.g. gold hoop earrings, red dupatta, jade bracelet…"
          maxLength={100}
          className="w-full px-4 py-3 rounded-xl border-2 border-sand-200 bg-white focus:outline-none focus:border-coral-400 text-sand-800 placeholder-sand-300 transition-colors text-sm"
        />
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="step-btn-ghost">← Back</button>
        <button
          onClick={onNext}
          disabled={!canContinue}
          className={['step-btn-primary', !canContinue ? 'opacity-50 cursor-not-allowed' : ''].join(' ')}
        >
          Next →
        </button>
      </div>
      {!canContinue && (
        <p className="text-center text-xs text-sand-400 mt-2">Pick a skin tone, hair style, and attire to continue</p>
      )}
    </div>
  );
}
