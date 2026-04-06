import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArcGauge } from '../components/ArcGauge';
import { HexagonalIndicator } from '../components/HexagonalIndicator';
import { ChevronDown, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { InstrumentBS } from '../components/InstrumentBS';
import { useTuner } from '../hooks/useTuner';

/**
 * TunerScreen - V4.0.0 Elite Edition "Tuner Pro"
 * Features: Arc Visualizer, Hexagonal Strings, Artist Tips, Ultra-Premium Dark.
 */

export const TunerScreen: React.FC = () => {
  const { 
    activeTuning, selectedInstrument, a4Calibration, noteNaming,
    isAutoMode, selectedStringIndex, setIsAutoMode, setSelectedStringIndex,
    hapticsEnabled, isOutdoorMode, theme
  } = useAppContext();

  const targetNote = (selectedStringIndex !== null) 
    ? activeTuning.notes[selectedStringIndex] 
    : null;

  const state = useTuner(a4Calibration, noteNaming, targetNote, hapticsEnabled);
  const { note, cents, isDetecting, startTuning, stopTuning, rms } = state;
  
  const [isBSOpen, setIsBSOpen] = useState(false);

  const toggleListening = () => {
    if (isDetecting) stopTuning();
    else startTuning();
  };

  const isPerfect = Math.abs(cents) < 2.5;
  const status = !isDetecting ? 'idle' : (isPerfect ? 'perfect' : 'detecting');
  const currentTheme = isOutdoorMode ? 'outdoor' : theme;

  return (
    <div className="screen-container" data-theme={currentTheme} style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      
      {/* 1. Elite Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
           <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-accent)', boxShadow: 'var(--glow-accent)' }} />
           <h2 style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '0.05em' }}>TUNER <span style={{ color: 'var(--color-accent)' }}>PRO</span></h2>
        </div>
        <button 
          onClick={() => setIsBSOpen(true)}
          className="glass-pill"
          style={{ padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-accent)' }}
        >
          <span className="label-text" style={{ fontSize: '9px', color: 'var(--color-accent)' }}>{selectedInstrument}</span>
          <ChevronDown size={14} />
        </button>
      </header>

      {/* 2. Calibration Info Pill */}
      <center>
         <button className="glass-pill" style={{ padding: '4px 16px', marginBottom: '24px' }}>
            <span className="label-text" style={{ fontSize: '8px', opacity: 0.6 }}>{selectedInstrument} - {activeTuning.name} ({a4Calibration}Hz)</span>
         </button>
      </center>

      {/* 3. Main Visualization Area */}
      <div 
        style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
        onClick={toggleListening}
      >
        <ArcGauge cents={cents} status={status} note={status === 'idle' ? '--' : note} />
        
        {/* Signal Level Indicator */}
        {isDetecting && (
           <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '40px', height: '2px', background: 'rgba(255,255,255,0.05)', borderRadius: '1px', overflow: 'hidden' }}>
                 <motion.div animate={{ width: `${Math.min(100, (rms / 0.1) * 100)}%` }} style={{ height: '100%', backgroundColor: 'var(--color-accent)' }} />
              </div>
              <span className="label-text" style={{ fontSize: '7px' }}>VIBRATION SENSE</span>
           </div>
        )}
      </div>

      {/* 4. The Pro String Bridge (Hexagonal Indicators) */}
      <div style={{ width: '100%', marginBottom: '32px' }}>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', padding: '0 10px' }}>
            {activeTuning.notes.map((s, i) => {
              const isActive = selectedStringIndex === i;
              const isMatch = note.startsWith(s.charAt(0)) && isDetecting;
              return (
                <HexagonalIndicator 
                   key={i} 
                   note={s} 
                   index={i}
                   isActive={isActive || isMatch} 
                   onClick={() => setSelectedStringIndex(i)} 
                />
              );
            })}
         </div>
      </div>

      {/* 5. Footer: Mode Selector & Artist Tip */}
      <div style={{ paddingBottom: '120px' }}>
         {/* Mode Toggle */}
         <div className="glass-pill" style={{ margin: '0 auto 24px', width: '200px', padding: '4px', display: 'flex' }}>
            <button 
              onClick={() => setIsAutoMode(true)}
              style={{ 
                flex: 1, height: '32px', borderRadius: '99px', fontSize: '10px', fontWeight: 800,
                backgroundColor: isAutoMode ? 'var(--color-accent)' : 'transparent',
                color: isAutoMode ? '#000' : 'var(--text-secondary)'
              }}
            >
              AUTO
            </button>
            <button 
              onClick={() => setIsAutoMode(false)}
              style={{ 
                flex: 1, height: '32px', borderRadius: '99px', fontSize: '10px', fontWeight: 800,
                backgroundColor: !isAutoMode ? 'var(--color-accent)' : 'transparent',
                color: !isAutoMode ? '#000' : 'var(--text-secondary)'
              }}
            >
              MANUAL
            </button>
         </div>

         {/* 6. Artist Pro Tip Card */}
         <motion.div 
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="glass-premium"
           style={{ margin: '0 20px', borderRadius: '20px', padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}
         >
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(26, 232, 232, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Sparkles size={20} color="var(--color-accent)" />
            </div>
            <div>
               <p className="label-text" style={{ fontSize: '9px', marginBottom: '4px', color: 'var(--color-accent)' }}>ARTIST PRO TIP</p>
               <p style={{ fontSize: '12px', opacity: 0.8, color: '#fcfcfc' }}>Check your harmonics at the 12th fret for perfect intonation.</p>
            </div>
         </motion.div>
      </div>

      <InstrumentBS isOpen={isBSOpen} onClose={() => setIsBSOpen(false)} />
    </div>
  );
};
