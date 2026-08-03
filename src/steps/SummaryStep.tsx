import { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { Profile, SCREENINGS, BARRIERS, VALUES } from '../data';
import {
  ATTRIBUTE_SECTIONS,
  optionLabel,
} from '../data/viewerAttributes';

interface SummaryStepProps {
  profile: Profile;
  onBack: () => void;
  /** Advance to the pipeline result page (runs RAG → script → video). */
  onGenerate: () => void;
}

/** Answered attributes only, in the order they were asked. */
function answeredAttributes(profile: Profile) {
  const attrs = profile.viewer_attributes;
  const rows: { key: string; prompt: string; value: string }[] = [];

  for (const section of ATTRIBUTE_SECTIONS) {
    for (const q of section.questions) {
      const raw = attrs[q.key];
      const values = Array.isArray(raw) ? raw : raw ? [raw] : [];
      if (values.length === 0) continue;
      rows.push({
        key: q.key,
        prompt: q.prompt,
        value: values.map((v) => optionLabel(q.key, v)).join(', '),
      });
    }
  }
  return rows;
}

export default function SummaryStep({ profile, onBack, onGenerate }: SummaryStepProps) {
  const [jsonOpen, setJsonOpen] = useState(false);

  const screening = SCREENINGS.find((s) => s.id === profile.screening_type);
  const topBarriers = BARRIERS.filter((b) => profile.barriers.includes(b.id));
  const chosenValues = VALUES.filter((v) => profile.values.includes(v.id));
  const attributeRows = answeredAttributes(profile);
  const identity = profile.viewer_attributes.intersectional_identity;

  return (
    <div className="max-w-xl mx-auto px-4 pb-12 animate-slide-up">
      {/* Hero */}
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-coral-400 to-coral-600 flex items-center justify-center shadow-lg mb-4">
          <span className="text-3xl">🎬</span>
        </div>
        <h2
          className="text-3xl font-bold mb-1"
          style={{ fontFamily: 'Georgia, serif', color: '#2d1a0e' }}
        >
          Ready to build your video
        </h2>
        <p className="text-sand-600 text-sm max-w-sm">
          Here's what your guide will know about you. Your guide's appearance and voice are
          chosen to match your community.
        </p>
      </div>

      {/* Summary card */}
      <div className="bg-white rounded-3xl border border-sand-200 shadow-sm p-6 mb-5">
        <div className="space-y-4">
          {screening && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-coral-100 flex items-center justify-center flex-shrink-0">
                <span className="text-base">{screening.icon}</span>
              </div>
              <div>
                <div className="text-xs font-semibold text-sand-400 uppercase tracking-wider mb-0.5">Video topic</div>
                <div className="text-sm font-medium text-sand-800">{screening.label}</div>
              </div>
            </div>
          )}

          {identity && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                <span className="text-base">🧭</span>
              </div>
              <div>
                <div className="text-xs font-semibold text-sand-400 uppercase tracking-wider mb-0.5">Intersectional identity</div>
                <div className="text-sm font-medium text-sand-800">{identity}</div>
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

          {topBarriers.length > 0 && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-coral-100 flex items-center justify-center flex-shrink-0">
                <span className="text-base">🎯</span>
              </div>
              <div>
                <div className="text-xs font-semibold text-sand-400 uppercase tracking-wider mb-1.5">The video will address</div>
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
        Generate my video
      </button>

      {/* What you told us */}
      {attributeRows.length > 0 && (
        <div className="bg-white rounded-2xl border border-sand-200 shadow-sm p-5 mb-3">
          <div className="text-sm font-semibold text-sand-800 mb-3 flex items-center gap-2">
            <span className="text-base">📝</span> What you told us
          </div>
          <dl className="space-y-2.5">
            {attributeRows.map((row) => (
              <div key={row.key} className="flex flex-col sm:flex-row sm:gap-3">
                <dt className="text-xs text-sand-400 sm:w-1/2 flex-shrink-0">{row.prompt}</dt>
                <dd className="text-sm text-sand-700 sm:w-1/2">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

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
        <button onClick={onBack} className="step-btn-ghost text-sm">← Back</button>
      </div>
    </div>
  );
}
