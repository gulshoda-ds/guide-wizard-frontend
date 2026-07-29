import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { Profile, SCREENINGS, BARRIERS, VALUES, PERSONAS, VIBES, assembleImagePrompt } from '../data';
import LiveAvatar from '../LiveAvatar';

interface SummaryStepProps {
  profile: Profile;
  onBack: () => void;
  /** Advance to the pipeline result page (runs RAG → script → video). */
  onGenerate: () => void;
}

export default function SummaryStep({ profile, onBack, onGenerate }: SummaryStepProps) {
  const [promptOpen, setPromptOpen] = useState(true);
  const [jsonOpen, setJsonOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const screening = SCREENINGS.find((s) => s.id === profile.screening_type);
  const topBarriers = BARRIERS.filter((b) => profile.barriers.includes(b.id));
  const chosenValues = VALUES.filter((v) => profile.values.includes(v.id));
  const persona = PERSONAS.find((p) => p.id === profile.guide_persona);
  const vibe = VIBES.find((v) => v.id === profile.guide_vibe);

  const imagePrompt = assembleImagePrompt(profile);

  const handleCopy = () => {
    navigator.clipboard.writeText(imagePrompt).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-xl mx-auto px-4 pb-12 animate-slide-up">
      {/* Hero */}
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="relative mb-4">
          <div className="w-36 h-36 rounded-full bg-gradient-to-br from-coral-50 to-teal-100 border-2 border-coral-200 flex items-center justify-center shadow-lg overflow-hidden">
            <LiveAvatar profile={profile} size="lg" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-9 h-9 bg-teal-400 rounded-full flex items-center justify-center shadow-md text-white text-sm font-bold">
            ✓
          </div>
        </div>
        <h2
          className="text-3xl font-bold mb-1"
          style={{ fontFamily: 'Georgia, serif', color: '#2d1a0e' }}
        >
          Meet your guide!
        </h2>
        <div className="flex items-center gap-1.5 text-teal-600 text-sm font-medium">
          <Sparkles size={14} />
          <span>Your guide is ready to build</span>
        </div>
      </div>

      {/* Summary card */}
      <div className="bg-white rounded-3xl border border-sand-200 shadow-sm p-6 mb-5">
        <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-sand-100">
          {persona && (
            <div>
              <div className="text-xs font-semibold text-sand-400 uppercase tracking-wider mb-1">Personality</div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg">{persona.emoji}</span>
                <span className="text-sm font-medium text-sand-800">{persona.label}</span>
              </div>
            </div>
          )}
          {vibe && (
            <div>
              <div className="text-xs font-semibold text-sand-400 uppercase tracking-wider mb-1">Energy</div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg">{vibe.emoji}</span>
                <span className="text-sm font-medium text-sand-800">{vibe.label}</span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {screening && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-coral-100 flex items-center justify-center flex-shrink-0">
                <span className="text-base">{screening.icon}</span>
              </div>
              <div>
                <div className="text-xs font-semibold text-sand-400 uppercase tracking-wider mb-0.5">Screening focus</div>
                <div className="text-sm font-medium text-sand-800">{screening.label}</div>
              </div>
            </div>
          )}

          {chosenValues.length > 0 && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                <span className="text-base">💛</span>
              </div>
              <div>
                <div className="text-xs font-semibold text-sand-400 uppercase tracking-wider mb-1.5">Grounded in</div>
                <div className="flex flex-wrap gap-1.5">
                  {chosenValues.map((v) => (
                    <span key={v.id} className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium border border-teal-100">
                      {v.emoji} {v.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {profile.viewer_attributes.intersectional_configuration && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                <span className="text-base">🧭</span>
              </div>
              <div>
                <div className="text-xs font-semibold text-sand-400 uppercase tracking-wider mb-0.5">About you</div>
                <div className="text-sm font-medium text-sand-800">
                  {profile.viewer_attributes.intersectional_configuration}
                </div>
              </div>
            </div>
          )}

          {topBarriers.length > 0 && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-coral-100 flex items-center justify-center flex-shrink-0">
                <span className="text-base">🎯</span>
              </div>
              <div>
                <div className="text-xs font-semibold text-sand-400 uppercase tracking-wider mb-1.5">Content will address</div>
                <ul className="space-y-0.5">
                  {topBarriers.map((b) => (
                    <li key={b.id} className="text-sm text-sand-600 flex items-start gap-1.5">
                      <span>{b.emoji}</span> {b.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {(chosenValues.length > 0 || topBarriers.length > 0) && (
          <div className="mt-4 pt-4 border-t border-sand-100 text-sand-600 text-sm leading-relaxed">
            Your guide will speak to{' '}
            <strong className="text-sand-800">
              {chosenValues.length > 0
                ? chosenValues.map((v) => v.label.toLowerCase()).join(' & ')
                : 'what matters to you'}
            </strong>{' '}
            and directly address{' '}
            <strong className="text-sand-800">
              {topBarriers.length > 0 ? topBarriers[0].label.toLowerCase() : 'your concerns'}
            </strong>
            .
          </div>
        )}
      </div>

      {/* CTA — hand off to the pipeline result page */}
      <button
        onClick={onGenerate}
        className="w-full step-btn-primary text-base py-4 mb-5 flex items-center justify-center gap-2"
      >
        <Sparkles size={18} />
        Generate my guide
      </button>

      {/* Image prompt panel */}
      <div className="bg-white rounded-2xl border border-sand-200 overflow-hidden mb-3 shadow-sm">
        <button
          onClick={() => setPromptOpen((p) => !p)}
          className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-sand-50 transition-colors"
        >
          <div>
            <div className="text-sm font-semibold text-sand-800 flex items-center gap-2">
              <span className="text-base">🎨</span> Image prompt
            </div>
            <div className="text-xs text-sand-400">Ready to paste into Nano Banana / Gemini</div>
          </div>
          {promptOpen ? <ChevronUp size={16} className="text-sand-400" /> : <ChevronDown size={16} className="text-sand-400" />}
        </button>
        {promptOpen && (
          <div className="px-5 pb-5">
            {imagePrompt ? (
              <>
                <pre className="bg-sand-50 rounded-xl p-4 text-xs text-sand-700 border border-sand-100 whitespace-pre-wrap leading-relaxed font-mono mb-3">
                  {imagePrompt}
                </pre>
                <button
                  onClick={handleCopy}
                  className={[
                    'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200',
                    copied
                      ? 'bg-teal-500 text-white'
                      : 'bg-coral-500 hover:bg-coral-600 text-white',
                  ].join(' ')}
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  {copied ? 'Copied!' : 'Copy prompt'}
                </button>
              </>
            ) : (
              <p className="text-sand-400 text-sm italic">Complete the look and scene steps to generate the image prompt.</p>
            )}
          </div>
        )}
      </div>

      {/* JSON panel */}
      <div className="bg-white rounded-2xl border border-sand-200 overflow-hidden shadow-sm">
        <button
          onClick={() => setJsonOpen((p) => !p)}
          className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-sand-50 transition-colors"
        >
          <div>
            <div className="text-sm font-semibold text-sand-800 flex items-center gap-2">
              <span className="text-base">📋</span> Profile data (JSON)
            </div>
            <div className="text-xs text-sand-400">Structured research payload for the personalization engine</div>
          </div>
          {jsonOpen ? <ChevronUp size={16} className="text-sand-400" /> : <ChevronDown size={16} className="text-sand-400" />}
        </button>
        {jsonOpen && (
          <div className="px-5 pb-5">
            <pre className="bg-sand-50 rounded-xl p-4 text-xs text-sand-700 border border-sand-100 overflow-auto max-h-96 leading-relaxed">
              {JSON.stringify(profile, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-center">
        <button onClick={onBack} className="step-btn-ghost text-sm">← Start over</button>
      </div>
    </div>
  );
}
