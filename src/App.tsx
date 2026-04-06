import React, { useState, useEffect, useRef } from 'react';
import { TunerScreen } from './screens/TunerScreen';
import { MetronomeScreen } from './screens/MetronomeScreen';
import { PitchPipeScreen } from './screens/PitchPipeScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { BottomNav, type TabType } from './components/BottomNav';
import { AppProvider, useAppContext } from './context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Main Content Component - Pro Suite V3.3.1
 * Features: Sleep Mode, URL Importer, Global Theme Orchestration.
 */

const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('tuner');
  const { isLoaded, setTuning, theme, isOutdoorMode } = useAppContext();
  
  // Sleep Mode State
  const [isIdle, setIsIdle] = useState(false);
  const idleTimerRef = useRef<number | null>(null);

  // 1. URL Tuning Importer
  useEffect(() => {
    if (!isLoaded) return;
    const params = new URLSearchParams(window.location.search);
    const tuningCode = params.get('tuning');
    if (tuningCode) {
      try {
        const decoded = atob(tuningCode);
        if (decoded.startsWith('TUNER:')) {
          const content = decoded.replace('TUNER:', '');
          const [name, notesStr] = content.split('|');
          const notes = notesStr.split(',');
          setTuning({ name: `Shared: ${name}`, notes });
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } catch (e) {
        console.error('URL Importer: Invalid tuning code', e);
      }
    }
  }, [isLoaded, setTuning]);

  // 2. Sleep Mode Logic
  const resetIdleTimer = () => {
    setIsIdle(false);
    if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    idleTimerRef.current = window.setTimeout(() => {
      setIsIdle(true);
    }, 60000);
  };

  useEffect(() => {
    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('touchstart', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);
    resetIdleTimer();
    return () => {
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('touchstart', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
    };
  }, []);

  if (!isLoaded) return null;

  // Determine actual rendered theme
  const currentTheme = isOutdoorMode ? 'outdoor' : theme;

  return (
    <div 
      data-theme={currentTheme}
      className="main-app-shell"
      style={{ 
        height: '100%', 
        position: 'relative', 
        opacity: isIdle ? 0.4 : 1, 
        transition: 'opacity 2s ease, background-color 0.4s ease',
        filter: isIdle ? 'blur(2px)' : 'none',
        backgroundColor: 'var(--bg-color)',
        color: 'var(--text-primary)'
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          style={{ height: '100%' }}
        >
          {activeTab === 'tuner' && <TunerScreen />}
          {activeTab === 'metronome' && <MetronomeScreen />}
          {activeTab === 'pitch' && <PitchPipeScreen />}
          {activeTab === 'settings' && <SettingsScreen />}
        </motion.div>
      </AnimatePresence>

      {isIdle && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
           <p className="label-text" style={{ fontSize: '12px', opacity: 0.5 }}>ACTIVE POWER SAVING MODE</p>
        </div>
      )}

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
};

export default App;
