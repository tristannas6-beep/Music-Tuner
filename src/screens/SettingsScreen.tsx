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
  Trophy
} from 'lucide-react';

/**
 * SettingsScreen - Pro Suite V3.3.0
 * Features: Haptics Toggle, Outdoor Toggle, Strobe Global Config, Score Reset.
 */

export const SettingsScreen: React.FC = () => {
  const { 
    a4Calibration, setA4Calibration,
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

  return (
    <div className="screen-container" data-theme={isOutdoorMode ? 'outdoor' : 'dark'}>
      <header style={{ marginTop: '20px', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800 }}>Pro Suite</h1>
        <p className="label-text" style={{ fontSize: '10px', color: 'var(--color-accent)' }}>V3.3.0 PREMIUM ACTIVE</p>
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
          border: isOutdoorMode ? '2px solid #000' : 'none'
        }}
      >
        <div style={{ color: 'white' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>Expert Performance</h3>
          <p style={{ fontSize: '12px', opacity: 0.8 }}>Current Ear Training: {earTrainingScore} Points</p>
        </div>
        <Trophy color="white" size={32} />
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Tactical Feedback Section */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: 'var(--text-secondary)' }}>
            <Smartphone size={16} />
            <span className="label-text">Tactic & Engine</span>
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

        {/* Visibility Section */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: 'var(--text-secondary)' }}>
            <Sun size={16} />
            <span className="label-text">Environment</span>
          </div>
          <div className="glass-premium" style={{ borderRadius: '24px', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--glass-border)' }}>
             <span style={{ fontWeight: 600 }}>Outdoor High-Contrast</span>
             <button 
               onClick={() => setIsOutdoorMode(!isOutdoorMode)}
               style={{ padding: '6px 16px', borderRadius: '12px', backgroundColor: isOutdoorMode ? 'var(--color-accent)' : 'rgba(255,255,255,0.05)', color: isOutdoorMode ? 'white' : 'var(--text-secondary)', fontSize: '12px', fontWeight: 700 }}
             >
               {isOutdoorMode ? 'ACTIVE' : 'OFF'}
             </button>
          </div>
        </section>

        {/* Calibration Section */}
        <section>
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: 'var(--text-secondary)' }}>
            <Volume2 size={16} />
            <span className="label-text">Standardization</span>
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
             onClick={() => updateEarTrainingScore(0)}
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

interface ToggleProps { label: string; active: boolean; onToggle: () => void; border?: boolean; }
const ToggleOption: React.FC<ToggleProps> = ({ label, active, onToggle, border }) => (
  <div 
    onClick={onToggle}
    style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: border ? '1px solid var(--glass-border)' : 'none', cursor: 'pointer' }}
  >
    <span style={{ fontWeight: 600 }}>{label}</span>
    <div style={{ width: '48px', height: '26px', backgroundColor: active ? 'var(--color-accent)' : 'rgba(128,128,128,0.2)', borderRadius: '13px', padding: '3px', display: 'flex', alignItems: 'center', justifyContent: active ? 'flex-end' : 'flex-start', transition: 'all 0.3s ease' }}>
      <motion.div layout style={{ width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '50%', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }} />
    </div>
  </div>
);
