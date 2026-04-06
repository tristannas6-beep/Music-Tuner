import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArcGauge } from '../components/ArcGauge';
import { ChevronDown, Activity } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { InstrumentBS } from '../components/InstrumentBS';
import { useTuner } from '../hooks/useTuner';
import { WaveformVisualizer } from '../components/WaveformVisualizer';

/**
 * TunerScreen - High-Fidelity Elite Edition v2.0
 * Features: Arc SVG Gauge, Metallic String Visualizer, Waveform Analytics.
 */

export const TunerScreen: React.FC = () => {
  const { 
    activeTuning, 
    selectedInstrument, 
    a4Calibration, 
    noteNaming,
    isAutoMode,
    selectedStringIndex,
    setIsAutoMode,
    setSelectedStringIndex
  } = useAppContext();

  const targetNote = (selectedStringIndex !== null) 
    ? activeTuning.notes[selectedStringIndex] 
    : null;

  const { 
    note, 
    cents, 
    isDetecting, 
    startTuning, 
    stopTuning,
    analyser
  } = useTuner(a4Calibration, noteNaming, targetNote);
  
  const [isBSOpen, setIsBSOpen] = useState(false);

  const toggleListening = () => {
    if (isDetecting) stopTuning();
    else startTuning();
  };

  const isPerfect = Math.abs(cents) < 3;
  const status = !isDetecting ? 'idle' : (isPerfect ? 'perfect' : 'detecting');

  return (
    <div className="screen-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* 1. Header: Glass-Pill Selector */}
      <motion.button 
        whileTap={{ scale: 0.95 }}
        className="glass-pill"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '10px 20px',
          marginTop: '10px',
          zIndex: 10
        }}
        onClick={() => setIsBSOpen(true)}
      >
        <div style={{ textAlign: 'left' }}>
          <p className="label-text" style={{ fontSize: '9px', marginBottom: '1px' }}>
            {selectedInstrument}
          </p>
          <p style={{ fontWeight: 700, fontSize: '14px', color: 'white' }}>{activeTuning.name}</p>
        </div>
        <ChevronDown size={16} color="var(--color-accent)" />
      </motion.button>

      {/* 2. Main Analytics Area */}
      <div 
        style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}
        onClick={toggleListening}
      >
        <ArcGauge 
          cents={cents} 
          status={status} 
          note={status === 'idle' ? '--' : note} 
        />
        
        {/* Analytics Waveform */}
        <div style={{ width: '85%', marginTop: '30px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', opacity: 0.5 }}>
             <Activity size={12} className={isDetecting ? 'neon-glow-cyan' : ''} />
             <span className="label-text" style={{ fontSize: '9px' }}>
               SIGNAL STRENGTH / ANALYTICS
             </span>
          </div>
          <div className="glass-premium" style={{ borderRadius: '16px', padding: '10px', overflow: 'hidden' }}>
            <WaveformVisualizer 
              analyser={analyser} 
              isDetecting={isDetecting} 
              color={isDetecting ? (isPerfect ? 'var(--color-success)' : 'var(--color-accent)') : 'rgba(255,255,255,0.05)'} 
            />
          </div>
          
          {/* Target / Auto Badge */}
          <div style={{ position: 'absolute', top: '-10px', right: '0' }}>
            <span className="label-text" style={{ 
              fontSize: '8px', 
              padding: '4px 8px', 
              borderRadius: '4px',
              backgroundColor: isAutoMode ? 'rgba(34, 211, 238, 0.1)' : 'rgba(245, 158, 11, 0.1)',
              color: isAutoMode ? 'var(--color-accent)' : 'var(--color-warning)',
              border: `1px solid ${isAutoMode ? 'rgba(34, 211, 238, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
            }}>
              {isAutoMode ? 'AUTO-TRACKING' : 'MANUAL LOCK'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. FOOTER: Metallic String Visualizer */}
      <div style={{ width: '100%', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'flex-end', height: '60px' }}>
          {activeTuning.notes.map((s, i) => {
            const isActive = selectedStringIndex === i;
            const isNoteMatch = note.startsWith(s.charAt(0)) && isDetecting;
            
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                {/* Visual String */}
                <div style={{ position: 'relative', width: '2px', height: '40px', backgroundColor: 'transparent' }}>
                   {/* String Body */}
                   <motion.div 
                     animate={{
                        x: isNoteMatch ? [0, -1, 1, -1, 0] : 0,
                        backgroundColor: isNoteMatch ? 'var(--color-accent)' : 'rgba(255,255,255,0.2)',
                        boxShadow: isNoteMatch ? '0 0 10px rgba(34, 211, 238, 0.8)' : 'none'
                     }}
                     transition={{ repeat: isNoteMatch ? Infinity : 0, duration: 0.1 }}
                     style={{
                       width: `${2 + (5-i)*0.5}px`, // Thicker strings for lower notes
                       height: '100%',
                       borderRadius: '2px',
                       background: 'linear-gradient(to bottom, #71717A, #E2E8F0, #71717A)',
                     }}
                   />
                </div>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedStringIndex(i)}
                  className={isActive ? 'glass-premium' : ''}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    border: '1px solid',
                    borderColor: isActive ? 'var(--color-accent)' : 'rgba(255, 255, 255, 0.05)',
                    backgroundColor: isActive ? 'rgba(34, 211, 238, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 800,
                    color: isActive ? 'var(--color-accent)' : 'var(--text-secondary)',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                  }}
                >
                  {s.replace(/\d+$/, '')}
                </motion.button>
              </div>
            );
          })}
        </div>
        
        {/* Premium Toggle */}
        <div 
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
          onClick={() => setIsAutoMode(!isAutoMode)}
        >
          <span className="label-text" style={{ fontSize: '10px', color: isAutoMode ? 'var(--color-accent)' : 'var(--text-secondary)' }}>
            AUTO
          </span>
          <div 
            className="glass-pill"
            style={{
              width: '44px',
              height: '24px',
              padding: '3px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isAutoMode ? 'flex-start' : 'flex-end',
              cursor: 'pointer',
              border: isAutoMode ? '1px solid rgba(34, 211, 238, 0.3)' : '1px solid transparent'
            }}>
            <motion.div 
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              style={{
                width: '16px',
                height: '16px',
                backgroundColor: isAutoMode ? 'var(--color-accent)' : 'var(--text-secondary)',
                borderRadius: '50%',
                boxShadow: isAutoMode ? '0 0 10px var(--color-accent)' : 'none'
              }} 
            />
          </div>
          <span className="label-text" style={{ fontSize: '10px', color: !isAutoMode ? 'var(--color-warning)' : 'var(--text-secondary)', opacity: !isAutoMode ? 1 : 0.5 }}>
            MANUAL
          </span>
        </div>
      </div>

      <InstrumentBS isOpen={isBSOpen} onClose={() => setIsBSOpen(false)} />
    </div>
  );
};
