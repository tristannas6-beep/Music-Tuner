import React, { useState, useEffect, useRef } from 'react';
import { TunerScreen } from './screens/TunerScreen';
import { MetronomeScreen } from './screens/MetronomeScreen';
import { PitchPipeScreen } from './screens/PitchPipeScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { SplashScreen } from './screens/SplashScreen';
import { PermissionScreen } from './screens/PermissionScreen';
import { BottomNav, type TabType } from './components/BottomNav';
import { AppProvider, useAppContext } from './context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Main Content Component - Pro Suite V4.0.0 Elite
 * Features: Multi-stage Entry Flow, Global Theme Orchestration, Sleep Mode.
 */

const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('tuner');
  const { isLoaded, setTuning, theme, isOutdoorMode, isPermissionGranted, setIsPermissionGranted } = useAppContext();
  
  const [showSplash, setShowSplash] = useState(true);

  // 1. Splash & Permission Orchestration
  useEffect(() => {
    if (!isLoaded) return;
    
    // a. Display Splash for 2.5 seconds
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    // b. Check physical permission (silent check)
    navigator.permissions.query({ name: 'microphone' as PermissionName }).then((result) => {
      if (result.state === 'granted') setIsPermissionGranted(true);
      else if (result.state === 'denied') setIsPermissionGranted(false);
    });

    return () => clearTimeout(splashTimer);
  }, [isLoaded, setIsPermissionGranted]);

  // 2. URL Tuning Importer
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

  // 3. Sleep Mode State
  const [isIdle, setIsIdle] = useState(false);
  const idleTimerRef = useRef<number | null>(null);

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

  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        <motion.div key="splash" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
          <SplashScreen />
        </motion.div>
      ) : (isPermissionGranted === null) ? (
        <motion.div key="permissions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <PermissionScreen />
        </motion.div>
      ) : (
        <motion.div 
          key="main" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          data-theme={isOutdoorMode ? 'outdoor' : theme}
          className="main-app-shell"
          style={{ 
            height: '100%', 
            position: 'relative', 
            opacity: isIdle ? 0.3 : 1, 
            transition: 'opacity 1.5s ease',
            filter: isIdle ? 'blur(3px)' : 'none',
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
              transition={{ duration: 0.3 }}
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
               <p className="label-text" style={{ fontSize: '10px', opacity: 0.4 }}>POWER SAVING MODULE ACTIVE</p>
            </div>
          )}

          <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </motion.div>
      )}
    </AnimatePresence>
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
