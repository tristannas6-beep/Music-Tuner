import React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { 
  ChevronRight, 
  Volume2, 
  Palette, 
  Globe, 
  ShieldCheck, 
  ArrowUpRight 
} from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const { 
    a4Calibration, 
    setA4Calibration,
    theme,
    setTheme,
    noteNaming,
    setNoteNaming,
    isLoaded
  } = useAppContext();

  const handleA4Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setA4Calibration(parseInt(e.target.value));
  };

  if (!isLoaded) {
    return (
      <div className="screen-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="label-text">Loading preferences...</div>
      </div>
    );
  }

  return (
    <div className="screen-container">
      <header style={{ marginTop: '20px', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800 }}>Settings</h1>
      </header>

      {/* Premium Banner */}
      <motion.div
        whileTap={{ scale: 0.98 }}
        style={{
          background: 'linear-gradient(135deg, #0074D9, #001f3f)',
          borderRadius: '24px',
          padding: '24px',
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 10px 30px rgba(0, 116, 217, 0.2)',
        }}
      >
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>Upgrade to Pro</h3>
          <p style={{ fontSize: '13px', opacity: 0.7 }}>No Ads, Custom Tunings, and more</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <ArrowUpRight color="#0074D9" size={24} />
        </div>
      </motion.div>

      {/* Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Audio Section */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', color: 'var(--text-secondary)' }}>
            <Volume2 size={18} />
            <span className="label-text">Audio</span>
          </div>
          
          <div className="glass" style={{ borderRadius: '24px', padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontWeight: 600 }}>A4 Calibration</span>
                <span style={{ color: 'var(--color-accent)', fontWeight: 800 }}>{a4Calibration} Hz</span>
              </div>
              <input 
                type="range" 
                min="430" 
                max="450" 
                step="1"
                value={a4Calibration}
                onChange={handleA4Change}
                style={{
                  width: '100%',
                  height: '6px',
                  borderRadius: '3px',
                  appearance: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  outline: 'none',
                }}
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600 }}>Noise Gate</span>
              <span className="label-text" style={{ fontSize: '12px' }}>Enabled</span>
            </div>
          </div>
        </section>

        {/* UI Section */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', color: 'var(--text-secondary)' }}>
            <Palette size={18} />
            <span className="label-text">Interface</span>
          </div>

          <div className="glass" style={{ borderRadius: '24px', display: 'flex', flexDirection: 'column' }}>
            {/* Theme Toggle */}
            <div 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              style={{
                padding: '20px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontWeight: 600 }}>Dark Mode</span>
              <div style={{
                width: '48px',
                height: '24px',
                backgroundColor: theme === 'dark' ? 'var(--color-accent)' : 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: theme === 'dark' ? 'flex-end' : 'flex-start',
                transition: 'all 0.3s ease'
              }}>
                <motion.div layout style={{ width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '50%' }} />
              </div>
            </div>

            {/* Note Naming Toggle */}
            <div 
              onClick={() => setNoteNaming(noteNaming === 'Letters' ? 'Solfege' : 'Letters')}
              style={{
                padding: '20px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontWeight: 600 }}>Note Naming</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-accent)' }}>
                <span style={{ fontSize: '14px', fontWeight: 700 }}>{noteNaming}</span>
                <ChevronRight size={18} />
              </div>
            </div>
          </div>
        </section>

        {/* Other Links */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { icon: Globe, label: 'Language' },
            { icon: ShieldCheck, label: 'Privacy Policy' }
          ].map((item, i) => (
            <div key={i} className="glass" style={{ 
              borderRadius: '20px', 
              padding: '16px 24px', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              cursor: 'pointer'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <item.icon size={18} color="var(--text-secondary)" />
                <span style={{ fontWeight: 500 }}>{item.label}</span>
              </div>
              <ChevronRight size={18} color="var(--text-secondary)" />
            </div>
          ))}
        </section>
      </div>

      <p className="label-text" style={{ textAlign: 'center', marginTop: '40px', opacity: 0.3, fontSize: '10px' }}>
        Music Tuner v1.1.0 (Build 2026)
      </p>
    </div>
  );
};
