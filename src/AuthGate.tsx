import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { getAuthStatus, UNAUTHORIZED_EVENT } from './lib/auth';
import LoginScreen from './LoginScreen';

type Gate = 'checking' | 'authed' | 'login';

/**
 * Gates its children behind the single-account login. Checks session status on
 * mount; shows the login screen when required, otherwise renders the app. Also
 * flips back to login if any API call reports 401 (session expired).
 */
export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [gate, setGate] = useState<Gate>('checking');
  const checked = useRef(false);

  useEffect(() => {
    if (!checked.current) {
      checked.current = true;
      getAuthStatus().then((s) => {
        setGate(s.login_required && !s.authenticated ? 'login' : 'authed');
      });
    }
    const onUnauthorized = () => setGate('login');
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
  }, []);

  if (gate === 'checking') {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#fdfaf5' }}>
        <Loader2 size={28} className="animate-spin text-coral-500" />
      </div>
    );
  }

  if (gate === 'login') {
    return <LoginScreen onSuccess={() => setGate('authed')} />;
  }

  return <>{children}</>;
}
