import { useRef } from 'react';
import { Survey } from 'survey-react-ui';
import { Model } from 'survey-core';
import 'survey-core/survey-core.min.css';
import { Profile, SCREENINGS, BARRIERS, LANGUAGES, VALUES, getSurveyJson } from '../data';

interface ConcernStepProps {
  profile: Profile;
  onChange: (u: Partial<Profile>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ConcernStep({ profile, onChange, onNext, onBack }: ConcernStepProps) {
  const surveyRef = useRef<Model | null>(null);

  const toggleBarrier = (id: string) => {
    const next = profile.barriers.includes(id)
      ? profile.barriers.filter((b) => b !== id)
      : [...profile.barriers, id];
    onChange({ barriers: next });
  };

  const toggleValue = (id: string) => {
    const next = profile.values.includes(id)
      ? profile.values.filter((v) => v !== id)
      : [...profile.values, id];
    onChange({ values: next });
  };

  const getSurveyModel = () => {
    if (surveyRef.current) return surveyRef.current;
    const model = new Model(getSurveyJson(profile.screening_type));
    model.applyTheme({ isPanelless: true });
    if (Object.keys(profile.survey_data).length > 0) model.data = profile.survey_data;
    model.onValueChanged.add((_s, opts) => {
      onChange({ survey_data: { ...profile.survey_data, [opts.name]: opts.value } });
    });
    surveyRef.current = model;
    return model;
  };

  const screening = SCREENINGS.find((s) => s.id === profile.screening_type);

  return (
    <div className="max-w-xl mx-auto px-4 pb-10 animate-slide-up">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif', color: '#2d1a0e' }}>
          What brings you here?
        </h2>
        <p className="text-sand-600">Help your guide understand you — no wrong answers.</p>
      </div>

      {/* Screening type */}
      <div className="mb-7">
        <p className="text-sm font-semibold text-sand-700 mb-3">Which screening are you here for today?</p>
        <div className="grid grid-cols-2 gap-3">
          {SCREENINGS.map((s) => {
            const selected = profile.screening_type === s.id;
            return (
              <button
                key={s.id}
                onClick={() => {
                  onChange({ screening_type: s.id });
                  surveyRef.current = null; // reset SurveyJS on type change
                }}
                className={[
                  'text-left p-4 rounded-2xl border-2 transition-all duration-200',
                  selected
                    ? 'border-coral-500 bg-gradient-to-br ' + s.color + ' shadow-md'
                    : 'border-sand-200 bg-white hover:border-coral-300 hover:shadow-sm hover:-translate-y-0.5',
                ].join(' ')}
              >
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className={['text-sm font-bold', selected ? '' : 'text-sand-800'].join(' ')} style={selected ? { color: s.accent } : {}}>
                  {s.label}
                </div>
                <div className="text-xs text-sand-500 mt-0.5">{s.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Barriers */}
      <div className="mb-7">
        <p className="text-sm font-semibold text-sand-700 mb-1">What's on your mind about this screening?</p>
        <p className="text-xs text-sand-400 mb-3">Pick everything that resonates — even a little.</p>
        <div className="flex flex-col gap-2">
          {BARRIERS.map((b) => {
            const sel = profile.barriers.includes(b.id);
            return (
              <button
                key={b.id}
                onClick={() => toggleBarrier(b.id)}
                className={[
                  'flex items-center gap-3 px-4 py-3 rounded-2xl border-2 text-left transition-all duration-200',
                  sel
                    ? 'border-coral-500 bg-coral-50 shadow-sm'
                    : 'border-sand-200 bg-white hover:border-coral-300 hover:bg-coral-50',
                ].join(' ')}
              >
                <span className="text-xl flex-shrink-0">{b.emoji}</span>
                <span className={['text-sm font-medium flex-1', sel ? 'text-coral-700' : 'text-sand-700'].join(' ')}>{b.label}</span>
                {sel && <span className="w-5 h-5 bg-coral-500 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Adaptive SurveyJS questions */}
      {profile.screening_type && (
        <div className="mb-7 bg-white rounded-2xl border border-sand-200 overflow-hidden">
          <div className="px-5 pt-4 pb-1">
            <p className="text-sm font-semibold text-sand-700">
              A few more questions about{' '}
              <span style={{ color: screening?.accent }}>{screening?.label.toLowerCase()}</span>
            </p>
          </div>
          <div className="px-2 pb-2">
            <Survey model={getSurveyModel()} />
          </div>
        </div>
      )}

      {/* Language */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-sand-700 mb-2">Which language feels most like home?</p>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => onChange({ language: lang })}
              className={['chip', profile.language === lang ? 'chip-selected' : 'chip-unselected'].join(' ')}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Values */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-sand-700 mb-1">What grounds you?</p>
        <p className="text-xs text-sand-400 mb-3">Shapes the tone of your content.</p>
        <div className="flex flex-wrap gap-2">
          {VALUES.map((v) => (
            <button
              key={v.id}
              onClick={() => toggleValue(v.id)}
              className={['chip', profile.values.includes(v.id) ? 'chip-selected' : 'chip-unselected'].join(' ')}
            >
              <span>{v.emoji}</span> {v.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="step-btn-ghost">← Back</button>
        <button
          onClick={onNext}
          disabled={!profile.screening_type}
          className={['step-btn-primary', !profile.screening_type ? 'opacity-50 cursor-not-allowed' : ''].join(' ')}
        >
          Meet your guide →
        </button>
      </div>
    </div>
  );
}
