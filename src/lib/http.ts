// Shared fetch plumbing for the pipeline backend.
//
// API base resolution: VITE_PIPELINE_API_BASE when set; otherwise same-origin
// (the FastAPI backend serves the built SPA, and the Vite dev server proxies
// /api, /videos and /auth to :7860 — see vite.config.ts).

export const API_BASE: string = (import.meta.env.VITE_PIPELINE_API_BASE as string | undefined)?.replace(/\/$/, '') ?? '';

/** Dispatched on window whenever an API call comes back 401 (session expired). */
export const UNAUTHORIZED_EVENT = 'app:unauthorized';

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });
  if (res.status === 401) {
    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    throw new Error('Your session has expired — please log in again.');
  }
  if (!res.ok) {
    const detail = await res.json().then((b) => b?.detail).catch(() => null);
    throw new Error(
      typeof detail === 'string' ? detail : `Request failed (${res.status} ${res.statusText})`,
    );
  }
  return (await res.json()) as T;
}
