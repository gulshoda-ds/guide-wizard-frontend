import { useState } from 'react';
import AvatarCreate from './pages/AvatarCreate';
import GuideWizard from './pages/GuideWizard';

type View = 'guide' | 'portrait';

export default function App() {
  // The guide wizard is the app — it opens straight on "Let's design your guide".
  const [view, setView] = useState<View>('guide');

  if (view === 'portrait') {
    return <AvatarCreate onBack={() => setView('guide')} />;
  }

  return <GuideWizard onOpenPortrait={() => setView('portrait')} />;
}
