// Client for the pipeline backend (src/serving/rest_app.py):
//   POST /api/intake        — wizard Profile → mapped question → full pipeline
//   POST /api/video         — queue a render job
//   GET  /api/video/{id}    — poll job status
//   GET  /videos/{filename} — serve the rendered file

import { Profile } from '../data';
import { API_BASE, apiFetch } from './http';

// ── Response shapes (mirror src/serving/models.py) ───────────────────────────

export interface IdentitySchemaModel {
  character_id: string;
  race_ethnicity: string;
  skin_tone: string;
  age_range: string;
  gender: string;
  build: string;
  hair: string;
  clothing: string;
  environment: string;
  voice: string;
  distinguishing_features: string;
  preferred_avatar_id: string;
  preferred_voice_id: string;
}

export interface ValidationResultModel {
  rule: string;
  passed: boolean;
  message: string;
}

export interface PipelineResponse {
  question: string;
  rag_answer: string;
  sources: string[];
  segments: string[];
  title: string;
  production_document: string;
  video_job_id: string | null;
  validation_results: ValidationResultModel[];
  validation_passed: boolean;
}

export interface IntakeResponse {
  mapping: {
    question: string;
    identity_schema: IdentitySchemaModel;
    derived_fields: string[];
  };
  pipeline: PipelineResponse;
}

export interface VideoJob {
  job_id: string;
  status: string;
  message: string;
}

export interface VideoStatus {
  job_id: string;
  status: 'queued' | 'creating' | 'polling' | 'downloading' | 'finished' | 'failed';
  message?: string;
  video_id?: string | null;
  provider?: string | null;
  download_url?: string | null;
  local_path?: string | null;
  progress?: string | null;
}

// ── Calls ────────────────────────────────────────────────────────────────────

/** Run the full pipeline from the completed wizard profile (~100s server-side). */
export const postIntake = (profile: Profile): Promise<IntakeResponse> =>
  apiFetch<IntakeResponse>('/api/intake', {
    method: 'POST',
    body: JSON.stringify({ profile, generate_video: false }),
  });

export const createVideo = (args: {
  segments: string[];
  title: string;
  identitySchema?: IdentitySchemaModel;
  provider?: 'synthesia' | 'descript';
}): Promise<VideoJob> =>
  apiFetch<VideoJob>('/api/video', {
    method: 'POST',
    body: JSON.stringify({
      segments: args.segments,
      title: args.title,
      provider: args.provider ?? 'synthesia',
      identity_schema: args.identitySchema ?? null,
    }),
  });

export const getVideoStatus = (jobId: string): Promise<VideoStatus> =>
  apiFetch<VideoStatus>(`/api/video/${encodeURIComponent(jobId)}`);

/** Playable URL for a finished job, or null if nothing is available yet. */
export function videoUrl(status: VideoStatus): string | null {
  if (status.local_path) {
    const filename = status.local_path.split('/').pop();
    if (filename) return `${API_BASE}/videos/${encodeURIComponent(filename)}`;
  }
  return status.download_url ?? null;
}
