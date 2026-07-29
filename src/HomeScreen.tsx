import { Camera, Clapperboard } from 'lucide-react';

interface HomeScreenProps {
  onSelectGuide: () => void;
  onSelectPortrait: () => void;
}

export default function HomeScreen({ onSelectGuide, onSelectPortrait }: HomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 relative overflow-hidden" style={{ backgroundColor: '#fdfaf5' }}>
      {/* Ambient blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-coral-100 rounded-full opacity-20 blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-100 rounded-full opacity-20 blur-3xl pointer-events-none -translate-x-1/2 translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-rose-100 rounded-full opacity-15 blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-coral-100 text-coral-600 text-xs font-semibold mb-5 tracking-wide uppercase">
            Cancer Screening Education
          </div>
          <h1
            className="text-4xl sm:text-5xl font-bold leading-tight mb-4"
            style={{ fontFamily: 'Georgia, serif', color: '#2d1a0e' }}
          >
            What would you like
            <br />
            <span className="text-coral-500">to create today?</span>
          </h1>
          <p className="text-sand-600 text-lg max-w-md mx-auto">
            One purpose — health education that speaks to you.
          </p>
        </div>

        {/* Tool cards */}
        <div className="grid sm:grid-cols-2 gap-5 mb-10 max-w-2xl mx-auto">
          {/* Primary — full guide video pipeline */}
          <button
            onClick={onSelectGuide}
            className="group text-left p-7 rounded-3xl bg-white border-2 border-coral-300 hover:border-coral-500 hover:shadow-xl transition-all duration-250 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-500"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-coral-500 to-rose-600 flex items-center justify-center mb-5 shadow-md group-hover:scale-105 transition-transform duration-200">
              <Clapperboard size={26} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-stone-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              Create your guide video
            </h2>
            <p className="text-stone-500 text-sm leading-relaxed mb-5">
              Build a personal health guide step by step, then generate a culturally-grounded educational video — script and all.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Personalized', 'RAG-grounded', 'Full video'].map((tag) => (
                <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-coral-50 text-coral-600 font-medium border border-coral-100">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-coral-600 text-sm font-semibold group-hover:gap-2.5 transition-all duration-200">
              Start building <span className="text-base">→</span>
            </div>
          </button>

          {/* Secondary — portrait prompt builder */}
          <button
            onClick={onSelectPortrait}
            className="group text-left p-7 rounded-3xl bg-white border-2 border-stone-200 hover:border-rose-400 hover:shadow-xl transition-all duration-250 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-700"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-700 to-rose-900 flex items-center justify-center mb-5 shadow-md group-hover:scale-105 transition-transform duration-200">
              <Camera size={26} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-stone-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              Portrait prompt only
            </h2>
            <p className="text-stone-500 text-sm leading-relaxed mb-5">
              Just want the image prompt? Describe how <em>you</em> want to be represented — generates a ready-to-use prompt for Google's Gemini image model.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Gemini-ready', 'Copyable JSON', 'Stays on device'].map((tag) => (
                <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-medium border border-rose-100">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-rose-700 text-sm font-semibold group-hover:gap-2.5 transition-all duration-200">
              Build my prompt <span className="text-base">→</span>
            </div>
          </button>
        </div>

        <p className="text-center text-sand-400 text-xs">
          No login required &bull; Educational tool only
        </p>
      </div>
    </div>
  );
}
