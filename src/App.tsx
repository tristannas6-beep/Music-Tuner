import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BottomNav, type TabType } from './components/BottomNav';
import { AppProvider } from './context/AppContext';
import { TunerScreen } from './screens/TunerScreen';
import { MetronomeScreen } from './screens/MetronomeScreen';
import { PitchPipeScreen } from './screens/PitchPipeScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { OnboardingModal } from './components/OnboardingModal';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('tuner');

  const renderScreen = () => {
    switch (activeTab) {
      case 'tuner': return <TunerScreen />;
      case 'metronome': return <MetronomeScreen />;
      case 'pitch': return <PitchPipeScreen />;
      case 'settings': return <SettingsScreen />;
      default: return <TunerScreen />;
    }
  };

  return (
    <AppProvider>
      <OnboardingModal />
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.02, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{ flex: 1 }}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </AppProvider>
  );
}

export default App;
