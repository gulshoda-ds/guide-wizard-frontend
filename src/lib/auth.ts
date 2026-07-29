// Client for the backend's single-account session login
// (src/serving/simple_auth.py). Cookies carry the session, so every request
// uses credentials: 'include'.

import { API_BASE, UNAUTHORIZED_EVENT } from './http';

export { UNAUTHORIZED_EVENT };

export interface AuthStatus {
  authenticated: boolean;
  email: string | null;
  login_required: boolean;
  mode?: string;
}

/** Session status. If the endpoint is absent (login disabled), treat as open. */
export async function getAuthStatus(): Promise<AuthStatus> {
  try {
    const res = await fetch(`${API_BASE}/api/auth/status`, { credentials: 'include' });
    if (!res.ok) {
      return { authenticated: false, email: null, login_required: false };
    }
    return (await res.json()) as AuthStatus;
  } catch {
    // Backend unreachable — let the app render; API calls surface their own errors.
    return { authenticated: false, email: null, login_required: false };
  }
}

export async function login(email: string, password: string): Promise<{ email: string }> {
  const res = await fetch(`${API_BASE}/api/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const detail = await res.json().then((b) => b?.detail).catch(() => null);
    throw new Error(typeof detail === 'string' ? detail : 'Invalid email or password');
  }
  const body = (await res.json()) as { ok: boolean; email: string };
  return { email: body.email };
}

export async function logout(): Promise<void> {
  await fetch(`${API_BASE}/api/logout`, { method: 'POST', credentials: 'include' }).catch(() => {});
}
