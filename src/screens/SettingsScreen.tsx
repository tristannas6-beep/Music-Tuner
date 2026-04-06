import React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { 
  ChevronRight, 
  Volume2, 
  Globe, 
  Zap,
  Smartphone,
  Sun,
  Trophy,
  Moon,
  Palette
} from 'lucide-react';

/**
 * SettingsScreen - Pro Suite V3.3.1
 * Features: Haptics, Outdoor Toggle, Standard Theme Toggle, Progress Reset.
 */

export const SettingsScreen: React.FC = () => {
  const { 
    a4Calibration, setA4Calibration,
    theme, setTheme,
    hapticsEnabled, setHapticsEnabled,
    isOutdoorMode, setIsOutdoorMode,
    strobeMode, setStrobeMode,
    earTrainingScore, updateEarTrainingScore,
    isLoaded
  } = useAppContext();

  const handleA4Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setA4Calibration(parseInt(e.target.value));
  };

  if (!isLoaded) {
    return (
      <div className="screen-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="label-text">Synchronizing Pro Suite...</div>
      </div>
    );
  }

  const currentThemeTag = isOutdoorMode ? 'outdoor' : theme;

  return (
    <div className="screen-container" data-theme={currentThemeTag}>
      <header style={{ marginTop: '20px', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800 }}>Pro Suite</h1>
        <p className="label-text" style={{ fontSize: '10px', color: 'var(--color-accent)' }}>V3.3.1 PREMIUM ACTIVE</p>
      </header>

      {/* Pro Stats Banner */}
      <motion.div
        style={{
          background: isOutdoorMode ? '#000' : 'linear-gradient(135deg, #10B981, #059669)',
          borderRadius: '24px',
          padding: '24px',
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: isOutdoorMode ? 'none' : '0 10px 30px rgba(16, 185, 129, 0.2)',
          border: isOutdoorMode ? '2px solid var(--glass-border)' : 'none'
        }}
      >
        <div style={{ color: 'white' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>Expert Performance</h3>
          <p style={{ fontSize: '12px', opacity: 0.8 }}>Current Ear Training: {earTrainingScore} Points</p>
        </div>
        <Trophy color="white" size={32} />
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Visibility Section */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: 'var(--text-secondary)' }}>
            <Palette size={16} />
            <span className="label-text">Appearance & Environment</span>
          </div>
          
          <div className="glass-premium" style={{ borderRadius: '24px', display: 'flex', flexDirection: 'column', border: '1px solid var(--glass-border)' }}>
             <ToggleOption 
               label={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"} 
               active={theme === 'light'} 
               icon={theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
               onToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
               border
             />
             <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Sun size={18} color="var(--text-primary)" />
                  <span style={{ fontWeight: 600 }}>Outdoor High-Contrast</span>
                </div>
                <button 
                  onClick={() => setIsOutdoorMode(!isOutdoorMode)}
                  className="glass-pill"
                  style={{ padding: '8px 20px', backgroundColor: isOutdoorMode ? 'var(--color-accent)' : 'transparent', color: isOutdoorMode ? 'white' : 'var(--text-secondary)', fontSize: '12px', fontWeight: 700 }}
                >
                  {isOutdoorMode ? 'ACTIVE' : 'ACTIVATE'}
                </button>
             </div>
          </div>
        </section>

        {/* Tactical Feedback Section */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: 'var(--text-secondary)' }}>
            <Smartphone size={16} />
            <span className="label-text">Engine & Tactic</span>
          </div>
          
          <div className="glass-premium" style={{ borderRadius: '24px', display: 'flex', flexDirection: 'column', border: '1px solid var(--glass-border)' }}>
            <ToggleOption 
              label="Haptic Feedback" 
              active={hapticsEnabled} 
              onToggle={() => setHapticsEnabled(!hapticsEnabled)} 
              border 
            />
            <ToggleOption 
              label="Strobe Tuner Mode" 
              active={strobeMode} 
              onToggle={() => setStrobeMode(!strobeMode)} 
            />
          </div>
        </section>

        {/* Calibration Section */}
        <section>
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: 'var(--text-secondary)' }}>
            <Volume2 size={16} />
            <span className="label-text">Standards</span>
           </div>
           <div className="glass-premium" style={{ borderRadius: '24px', padding: '24px', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                 <span style={{ fontWeight: 600 }}>A4 Frequency</span>
                 <span style={{ color: 'var(--color-accent)', fontWeight: 800 }}>{a4Calibration} Hz</span>
              </div>
              <input type="range" min="430" max="450" value={a4Calibration} onChange={handleA4Change} style={{ width: '100%', height: '4px', borderRadius: '2px', appearance: 'none', backgroundColor: 'var(--glass-border)', outline: 'none' }} />
           </div>
        </section>

        {/* About Section */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '100px' }}>
           <div className="glass-premium" style={{ borderRadius: '20px', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                 <Globe size={16} color="var(--text-secondary)" />
                 <span style={{ fontSize: '14px', fontWeight: 500 }}>Global Community</span>
              </div>
              <ChevronRight size={18} color="var(--text-secondary)" />
           </div>
           
           <div 
             onClick={() => { if(window.confirm('Reset progress?')) updateEarTrainingScore(0); }}
             className="glass-premium" 
             style={{ borderRadius: '20px', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--glass-border)', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                   <Zap size={16} color="var(--color-danger)" />
                   <span style={{ fontSize: '14px', fontWeight: 500 }}>Reset Pro Progress</span>
                </div>
                <span className="label-text" style={{ fontSize: '10px' }}>CLEAR</span>
           </div>
        </section>
      </div>

      <p className="label-text" style={{ textAlign: 'center', marginTop: '-60px', opacity: 0.3, fontSize: '9px' }}>
        MUSIC TUNER PRO SUITE • ENTERPRISE EDITION
      </p>
    </div>
  );
};

interface ToggleProps { label: string; active: boolean; onToggle: () => void; border?: boolean; icon?: React.ReactNode; }
const ToggleOption: React.FC<ToggleProps> = ({ label, active, onToggle, border, icon }) => (
  <div 
    onClick={onToggle}
    style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: border ? '1px solid var(--glass-border)' : 'none', cursor: 'pointer' }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      {icon}
      <span style={{ fontWeight: 600 }}>{label}</span>
    </div>
    <div style={{ width: '48px', height: '26px', backgroundColor: active ? 'var(--color-accent)' : 'rgba(128,128,128,0.2)', borderRadius: '13px', padding: '3px', display: 'flex', alignItems: 'center', justifyContent: active ? 'flex-end' : 'flex-start', transition: 'all 0.3s ease' }}>
      <motion.div layout style={{ width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '50%', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }} />
    </div>
  </div>
);
