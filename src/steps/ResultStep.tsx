import { useEffect, useRef, useState } from 'react';
import {
  Sparkles, Loader2, AlertCircle, Check, X, FileText, BookOpen,
  ShieldCheck, ShieldAlert, Film, RotateCcw,
} from 'lucide-react';
import { Profile } from '../data';
import {
  postIntake, createVideo, getVideoStatus, videoUrl,
  type IntakeResponse, type VideoStatus,
} from '../lib/postIntake';

interface ResultStepProps {
  profile: Profile;
  onBack: () => void;
  onRestart: () => void;
}

type IntakePhase = 'loading' | 'ready' | 'error';
type VideoPhase = 'idle' | 'working' | 'finished' | 'failed';

const STATUS_LABEL: Record<VideoStatus['status'], string> = {
  queued: 'Queued…',
  creating: 'Creating video…',
  polling: 'Rendering…',
  downloading: 'Downloading…',
  finished: 'Done!',
  failed: 'Failed',
};

export default function ResultStep({ profile, onBack, onRestart }: ResultStepProps) {
  const [phase, setPhase] = useState<IntakePhase>('loading');
  const [intake, setIntake] = useState<IntakeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [videoPhase, setVideoPhase] = useState<VideoPhase>('idle');
  const [videoStatus, setVideoStatus] = useState<VideoStatus | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedRef = useRef(false);

  // ── Run the pipeline intake EXACTLY once ─────────────────────────────────
  // Guarded against React StrictMode's dev double-invoke. We deliberately do
  // NOT abort on cleanup: the intake POST kicks off an expensive ~100s pipeline
  // run server-side, and aborting it would (a) waste that run and (b) swallow
  // the response, leaving the UI stuck on "loading". The ref survives the
  // StrictMode unmount/remount, so the request fires once and its result lands.
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    setPhase('loading');
    postIntake(profile)
      .then((resp) => {
        setIntake(resp);
        setPhase('ready');
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : 'Pipeline failed');
        setPhase('error');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Stop any in-flight video polling when the user leaves this screen.
  useEffect(() => () => {
    if (pollRef.current) clearInterval(pollRef.current);
  }, []);

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const handleGenerateVideo = async () => {
    if (!intake) return;
    setVideoError(null);
    setVideoPhase('working');
    setVideoStatus(null);
    try {
      const job = await createVideo({
        segments: intake.pipeline.segments,
        title: intake.pipeline.title || intake.mapping.question.slice(0, 60),
        identitySchema: intake.mapping.identity_schema,
      });
      // Poll for completion.
      stopPolling();
      pollRef.current = setInterval(async () => {
        try {
          const s = await getVideoStatus(job.job_id);
          setVideoStatus(s);
          if (s.status === 'finished') {
            stopPolling();
            setVideoPhase('finished');
          } else if (s.status === 'failed') {
            stopPolling();
            setVideoPhase('failed');
            setVideoError(s.message || 'Rendering failed');
          }
        } catch (e) {
          stopPolling();
          setVideoPhase('failed');
          setVideoError(e instanceof Error ? e.message : 'Lost connection to the render job');
        }
      }, 3000);
    } catch (e) {
      setVideoPhase('failed');
      setVideoError(e instanceof Error ? e.message : 'Could not start video render');
    }
  };

  const validationPassed = intake?.pipeline.validation_passed ?? false;
  const playUrl = videoStatus ? videoUrl(videoStatus) : null;

  return (
    <div className="max-w-xl mx-auto px-4 pb-12 animate-slide-up">
      {/* Hero */}
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="relative mb-4">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-coral-50 to-teal-100 border-2 border-coral-200 flex items-center justify-center shadow-lg overflow-hidden">
            <span className="text-5xl">🎬</span>
          </div>
          {phase === 'ready' && (
            <div className="absolute -bottom-1 -right-1 w-9 h-9 bg-teal-400 rounded-full flex items-center justify-center shadow-md text-white text-sm font-bold">
              ✓
            </div>
          )}
        </div>
        <h2 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Georgia, serif', color: '#2d1a0e' }}>
          {phase === 'loading' ? 'Building your guide…' : 'Your guide’s message'}
        </h2>
        {intake?.pipeline.title && (
          <p className="text-sand-600 text-sm mt-1">“{intake.pipeline.title}”</p>
        )}
      </div>

      {/* Loading */}
      {phase === 'loading' && (
        <div className="bg-white rounded-3xl border border-sand-200 shadow-sm p-8 flex flex-col items-center gap-3 text-center">
          <Loader2 size={28} className="animate-spin text-coral-500" />
          <p className="text-sand-600 text-sm leading-relaxed">
            Retrieving culturally-grounded guidance, writing the script, and validating it…
          </p>
        </div>
      )}

      {/* Error */}
      {phase === 'error' && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-center gap-2 text-red-700 font-semibold mb-2">
            <AlertCircle size={18} /> Something went wrong
          </div>
          <p className="text-sm text-red-700 mb-4 break-words">{error}</p>
          <button onClick={() => window.location.reload()} className="step-btn-ghost text-sm">
            Try again
          </button>
        </div>
      )}

      {/* Ready */}
      {phase === 'ready' && intake && (
        <div className="space-y-4">
          {/* Mapped question */}
          <div className="bg-white rounded-2xl border border-sand-200 shadow-sm p-5">
            <div className="text-xs font-semibold text-sand-400 uppercase tracking-wider mb-1.5">
              What we asked on your behalf
            </div>
            <p className="text-sm text-sand-800 leading-relaxed">{intake.mapping.question}</p>
          </div>

          {/* Script segments */}
          <div className="bg-white rounded-2xl border border-sand-200 shadow-sm p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-sand-800 mb-3">
              <FileText size={16} className="text-coral-500" /> Your guide’s script
            </div>
            {intake.pipeline.segments.length > 0 ? (
              <ol className="space-y-2.5">
                {intake.pipeline.segments.map((seg, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-coral-100 text-coral-600 text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <p className="text-sm text-sand-700 leading-relaxed">{seg}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sand-400 text-sm italic">No script segments were produced.</p>
            )}
          </div>

          {/* RAG answer + validation row */}
          <div className="grid gap-4">
            <details className="bg-white rounded-2xl border border-sand-200 shadow-sm p-5 group">
              <summary className="flex items-center gap-2 text-sm font-semibold text-sand-800 cursor-pointer list-none">
                <BookOpen size={16} className="text-teal-500" /> Grounding & sources
                <span className="ml-auto text-xs text-sand-400">{intake.pipeline.sources.length} source(s)</span>
              </summary>
              <p className="mt-3 text-sm text-sand-600 leading-relaxed whitespace-pre-wrap">
                {intake.pipeline.rag_answer}
              </p>
              {intake.pipeline.sources.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {intake.pipeline.sources.map((s) => (
                    <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </details>

            <div
              className={[
                'flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium',
                validationPassed
                  ? 'border-teal-200 bg-teal-50 text-teal-700'
                  : 'border-amber-200 bg-amber-50 text-amber-700',
              ].join(' ')}
            >
              {validationPassed ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
              {validationPassed
                ? 'Script passed all safety & production checks.'
                : 'Script has validation warnings — review before rendering.'}
            </div>
          </div>

          {/* Video generation */}
          <div className="bg-white rounded-2xl border border-sand-200 shadow-sm p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-sand-800 mb-3">
              <Film size={16} className="text-coral-500" /> Video
            </div>

            {videoPhase === 'idle' && (
              <button
                onClick={handleGenerateVideo}
                disabled={!validationPassed}
                className="w-full step-btn-primary text-base py-3.5 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles size={18} />
                {validationPassed ? 'Render this video' : 'Fix validation to render'}
              </button>
            )}

            {videoPhase === 'working' && (
              <div className="flex items-center gap-3 rounded-xl bg-sand-50 border border-sand-100 px-4 py-3">
                <Loader2 size={18} className="animate-spin text-coral-500 flex-shrink-0" />
                <div className="text-sm text-sand-700">
                  {videoStatus ? STATUS_LABEL[videoStatus.status] : 'Submitting…'}
                  {videoStatus?.progress ? ` (${videoStatus.progress})` : ''}
                  {videoStatus?.message ? <div className="text-xs text-sand-400 mt-0.5">{videoStatus.message}</div> : null}
                </div>
              </div>
            )}

            {videoPhase === 'finished' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-teal-700">
                  <Check size={16} /> {STATUS_LABEL.finished}
                </div>
                {playUrl ? (
                  <video
                    src={playUrl}
                    controls
                    className="w-full rounded-xl border border-sand-200 bg-black"
                  />
                ) : (
                  <p className="text-sand-500 text-sm">Rendered, but no playable URL was returned.</p>
                )}
              </div>
            )}

            {videoPhase === 'failed' && (
              <div className="space-y-3">
                <div className="flex items-start gap-2 text-sm text-red-700">
                  <X size={16} className="mt-0.5 flex-shrink-0" />
                  <span className="break-words">{videoError ?? 'Rendering failed.'}</span>
                </div>
                <button onClick={handleGenerateVideo} className="step-btn-ghost text-sm flex items-center gap-1.5">
                  <RotateCcw size={14} /> Retry render
                </button>
              </div>
            )}
          </div>

          {/* derived-field transparency (only if the wizard didn't collect something) */}
          {intake.mapping.derived_fields.length > 0 && (
            <p className="text-xs text-sand-400 text-center">
              Some identity details were inferred: {intake.mapping.derived_fields.join(', ')}
            </p>
          )}
        </div>
      )}

      {/* Footer nav */}
      <div className="mt-8 flex justify-center gap-4">
        <button onClick={onBack} className="step-btn-ghost text-sm">← Back to summary</button>
        <button onClick={onRestart} className="step-btn-ghost text-sm">Start over</button>
      </div>
    </div>
  );
}
