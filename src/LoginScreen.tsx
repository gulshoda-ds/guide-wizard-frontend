import { useState } from 'react';
import { Lock, Loader2, AlertCircle, LogIn } from 'lucide-react';
import { login } from './lib/auth';

export default function LoginScreen({ onSuccess }: { onSuccess: (email: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { email: who } = await login(email.trim(), password);
      onSuccess(who);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-4 py-12 relative overflow-hidden"
      style={{ backgroundColor: '#fdfaf5' }}
    >
      {/* Ambient blobs (match HomeScreen) */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-coral-100 rounded-full opacity-20 blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-100 rounded-full opacity-20 blur-3xl pointer-events-none -translate-x-1/2 translate-y-1/2" />

      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-coral-500 to-rose-600 flex items-center justify-center mx-auto mb-5 shadow-md">
            <Lock size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif', color: '#2d1a0e' }}>
            Sign in
          </h1>
          <p className="text-sand-600 text-sm">Enter your credentials to continue.</p>
        </div>

        <form onSubmit={submit} className="bg-white rounded-3xl border border-sand-200 shadow-sm p-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-sand-500 uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-sand-200 px-4 py-2.5 text-sm text-sand-800 focus:outline-none focus:ring-2 focus:ring-coral-300 focus:border-coral-300"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-sand-500 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-sand-200 px-4 py-2.5 text-sm text-sand-800 focus:outline-none focus:ring-2 focus:ring-coral-300 focus:border-coral-300"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full step-btn-primary text-base py-3 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {busy ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-sand-400 text-xs mt-6">Authorized access only</p>
      </div>
    </div>
  );
}
