

interface WelcomeStepProps {
  onStart: () => void;
  onBack?: () => void;
}

export default function WelcomeStep({ onStart, onBack }: WelcomeStepProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[72vh] text-center px-6 animate-fade-in relative">
      <div className="absolute top-16 left-8 w-44 h-44 bg-coral-200 rounded-full opacity-20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-8 w-60 h-60 bg-teal-200 rounded-full opacity-20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-12 w-32 h-32 bg-sand-300 rounded-full opacity-15 blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-md">
        <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-coral-400 to-coral-600 rounded-3xl flex items-center justify-center shadow-xl animate-scale-in">
          <span className="text-5xl">🌟</span>
        </div>

        <h1
          className="text-4xl sm:text-5xl font-bold mb-4 leading-tight"
          style={{ fontFamily: 'Georgia, serif', color: '#2d1a0e' }}
        >
          Let's design
          <br />
          <span className="text-coral-500">your guide.</span>
        </h1>

        <p className="text-sand-700 text-lg mb-3 leading-relaxed">
          You're going to build a personalized health guide — a companion who looks like someone{' '}
          <em>you'd actually listen to</em>, and speaks directly to your concerns.
        </p>

        <p className="text-sand-500 text-sm mb-10">
          About 3 minutes &bull; No login &bull; Your choices stay private
        </p>

        <button onClick={onStart} className="step-btn-primary text-lg px-10 py-4">
          Let's design them ✨
        </button>

        <p className="text-sand-400 text-xs mt-6">
          Educational tool only — no medical advice is provided.
        </p>

        {onBack && (
          <button
            onClick={onBack}
            className="mt-4 text-sand-400 hover:text-sand-600 text-xs transition-colors"
          >
            ← Back to home
          </button>
        )}
      </div>
    </div>
  );
}
