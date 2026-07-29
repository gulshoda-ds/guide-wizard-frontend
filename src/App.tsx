import { useState } from 'react';
import HomeScreen from './HomeScreen';
import AvatarCreate from './pages/AvatarCreate';
import GuideWizard from './pages/GuideWizard';

type View = 'home' | 'guide' | 'portrait';

export default function App() {
  const [view, setView] = useState<View>('home');

  const goHome = () => setView('home');

  if (view === 'guide') {
    return <GuideWizard onBack={goHome} />;
  }
  if (view === 'portrait') {
    return <AvatarCreate onBack={goHome} />;
  }

  return (
    <HomeScreen
      onSelectGuide={() => setView('guide')}
      onSelectPortrait={() => setView('portrait')}
    />
  );
}
