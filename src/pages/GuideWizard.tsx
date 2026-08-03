import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Profile, defaultProfile } from '../data';
import WelcomeStep from '../steps/WelcomeStep';
import PersonalityStep from '../steps/PersonalityStep';
import LookStep from '../steps/LookStep';
import SceneStep from '../steps/SceneStep';
import ConcernStep from '../steps/ConcernStep';
import AboutYouStep from '../steps/AboutYouStep';
import SummaryStep from '../steps/SummaryStep';
import ResultStep from '../steps/ResultStep';

// The wizard steps, in order. "result" runs the backend pipeline.
const STEPS = [
  'welcome',
  'personality',
  'look',
  'scene',
  'concern',
  'about_you',
  'summary',
  'result',
] as const;
type StepName = (typeof STEPS)[number];

// Steps shown in the top progress bar (welcome/result are framing, not counted).
const PROGRESS_STEPS: StepName[] = ['personality', 'look', 'scene', 'concern', 'about_you', 'summary'];

export default function GuideWizard({ onOpenPortrait }: { onOpenPortrait?: () => void }) {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [stepIndex, setStepIndex] = useState(0);

  const step = STEPS[stepIndex];
  const go = (name: StepName) => {
    setStepIndex(STEPS.indexOf(name));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const next = () => go(STEPS[Math.min(stepIndex + 1, STEPS.length - 1)]);
  // "welcome" is the app's entry point, so there is nowhere to go back to from it.
  const back = () => {
    if (stepIndex > 0) go(STEPS[stepIndex - 1]);
  };
  const restart = () => {
    setProfile(defaultProfile());
    go('welcome');
  };

  const update = (u: Partial<Profile>) => setProfile((p) => ({ ...p, ...u }));

  const progressIdx = PROGRESS_STEPS.indexOf(step);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdfaf5' }}>
      {/* Warm top strip */}
      <div className="h-1 w-full bg-gradient-to-r from-rose-800 via-rose-600 to-amber-500" />

      {/* Nav + progress */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-stone-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          {stepIndex > 0 && (
            <>
              <button
                type="button"
                onClick={back}
                className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 transition-colors font-medium"
              >
                <ArrowLeft size={15} /> Back
              </button>
              <span className="text-stone-200">|</span>
            </>
          )}
          <span className="text-sm font-semibold text-stone-700" style={{ fontFamily: 'Georgia, serif' }}>
            Create your guide
          </span>

          {progressIdx >= 0 && (
            <div className="ml-auto flex items-center gap-1.5">
              {PROGRESS_STEPS.map((s, i) => (
                <span
                  key={s}
                  className={[
                    'h-1.5 rounded-full transition-all duration-300',
                    i <= progressIdx ? 'w-6 bg-coral-400' : 'w-3 bg-sand-200',
                  ].join(' ')}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="py-8">
        {step === 'welcome' && <WelcomeStep onStart={next} onOpenPortrait={onOpenPortrait} />}
        {step === 'personality' && (
          <PersonalityStep profile={profile} onChange={update} onNext={next} onBack={back} />
        )}
        {step === 'look' && (
          <LookStep profile={profile} onChange={update} onNext={next} onBack={back} />
        )}
        {step === 'scene' && (
          <SceneStep profile={profile} onChange={update} onNext={next} onBack={back} />
        )}
        {step === 'concern' && (
          <ConcernStep profile={profile} onChange={update} onNext={next} onBack={back} />
        )}
        {step === 'about_you' && (
          <AboutYouStep profile={profile} onChange={update} onNext={next} onBack={back} />
        )}
        {step === 'summary' && (
          <SummaryStep profile={profile} onBack={back} onGenerate={next} />
        )}
        {step === 'result' && (
          <ResultStep profile={profile} onBack={back} onRestart={restart} />
        )}
      </div>
    </div>
  );
}
