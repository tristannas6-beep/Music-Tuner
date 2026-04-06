import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArcGauge } from '../components/ArcGauge';
import { ChevronDown, Sun, Zap, Disc } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { InstrumentBS } from '../components/InstrumentBS';
import { useTuner } from '../hooks/useTuner';

/**
 * TunerScreen - Pro Suite V3.0.0
 * Features: Strobe Mode, Outdoor Mode, High-Contrast Visualization.
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
    setSelectedStringIndex,
    hapticsEnabled,
    isOutdoorMode,
    setIsOutdoorMode,
    strobeMode,
    setStrobeMode
  } = useAppContext();

  const targetNote = (selectedStringIndex !== null) 
    ? activeTuning.notes[selectedStringIndex] 
    : null;

  const state = useTuner(a4Calibration, noteNaming, targetNote, hapticsEnabled);
  const { 
    note, 
    cents, 
    isDetecting, 
    startTuning, 
    stopTuning,
    strobeAngle
  } = state;
  
  const [isBSOpen, setIsBSOpen] = useState(false);

  const toggleListening = () => {
    if (isDetecting) stopTuning();
    else startTuning();
  };

  const isPerfect = Math.abs(cents) < 2.5;
  const status = !isDetecting ? 'idle' : (isPerfect ? 'perfect' : 'detecting');

  return (
    <div className="screen-container" data-theme={isOutdoorMode ? 'outdoor' : 'dark'} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* 1. Pro Header Controls */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', zIndex: 20 }}>
        <button 
          onClick={() => setIsOutdoorMode(!isOutdoorMode)}
          className="glass-pill"
          style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderColor: isOutdoorMode ? 'var(--color-warning)' : 'var(--glass-border)' }}
        >
          <Sun size={18} color={isOutdoorMode ? 'var(--color-warning)' : 'var(--text-secondary)'} />
        </button>

        <motion.button 
          whileTap={{ scale: 0.95 }}
          className="glass-pill"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}
          onClick={() => setIsBSOpen(true)}
        >
          <div style={{ textAlign: 'left' }}>
            <p className="label-text" style={{ fontSize: '8px' }}>{selectedInstrument}</p>
            <p style={{ fontWeight: 700, fontSize: '13px' }}>{activeTuning.name}</p>
          </div>
          <ChevronDown size={14} color="var(--color-accent)" />
        </motion.button>

        <button 
          onClick={() => setStrobeMode(!strobeMode)}
          className="glass-pill"
          style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderColor: strobeMode ? 'var(--color-accent)' : 'var(--glass-border)' }}
        >
          {strobeMode ? <Zap size={18} color="var(--color-accent)" /> : <Disc size={18} color="var(--text-secondary)" />}
        </button>
      </div>

      {/* 2. Tuner Visualization Area */}
      <div 
        style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}
        onClick={toggleListening}
      >
        <AnimatePresence mode="wait">
          {!strobeMode ? (
            <motion.div 
              key="arc"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
            >
              <ArcGauge cents={cents} status={status} note={status === 'idle' ? '--' : note} />
            </motion.div>
          ) : (
            <motion.div 
              key="strobe"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              style={{ position: 'relative', width: '300px', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
               {/* Strobe Disk Visualizer */}
               <div style={{ position: 'absolute', inset: 0, border: '2px solid var(--glass-border)', borderRadius: '50%' }} />
               <motion.div
                 style={{
                   width: '240px',
                   height: '240px',
                   borderRadius: '50%',
                   border: '8px dashed var(--color-accent)',
                   opacity: isDetecting ? 0.8 : 0.1,
                   rotate: strobeAngle
                 }}
               />
               <motion.div
                 style={{
                   position: 'absolute',
                   width: '180px',
                   height: '180px',
                   borderRadius: '50%',
                   border: '12px dashed var(--color-accent)',
                   opacity: isDetecting ? 0.4 : 0.05,
                   rotate: -strobeAngle * 1.5
                 }}
               />
               
               <div style={{ position: 'absolute', zIndex: 10, textAlign: 'center' }}>
                  <h1 className="huge-text" style={{ fontSize: '72px', color: isPerfect ? 'var(--color-success)' : 'white' }}>{status === 'idle' ? '--' : note}</h1>
                  <p className="label-text" style={{ fontSize: '10px', color: isPerfect ? 'var(--color-success)' : 'var(--text-secondary)' }}>
                    {isPerfect ? 'STROBE LOCKED' : 'ANALYZING...'}
                  </p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* 3. Signal Strength Indicator (Android Debugging) */}
        {isDetecting && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <div style={{ width: '60px', height: '4px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
               <motion.div 
                 animate={{ width: `${Math.min(100, (state.rms / 0.1) * 100)}%` }}
                 style={{ height: '100%', backgroundColor: state.rms > 0.005 ? 'var(--color-success)' : 'var(--text-secondary)' }}
               />
            </div>
            <span className="label-text" style={{ fontSize: '8px' }}>
              {state.rms > 0 ? 'SIGNAL DETECTED' : 'QUIET / NO INPUT'}
            </span>
          </motion.div>
        )}
      </div>

      {/* 3. Footer: Metallic Strings */}
      <div style={{ width: '100%', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'flex-end', height: '60px' }}>
          {activeTuning.notes.map((s, i) => {
            const isActive = selectedStringIndex === i;
            const isNoteMatch = note.startsWith(s.charAt(0)) && isDetecting;
            
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ position: 'relative', width: '2px', height: '40px', backgroundColor: 'transparent' }}>
                   <motion.div 
                     animate={{
                        x: isNoteMatch ? [0, -1, 1, -1, 0] : 0,
                        backgroundColor: isNoteMatch ? 'var(--color-accent)' : 'rgba(128,128,128,0.3)',
                        boxShadow: (isNoteMatch && !isOutdoorMode) ? '0 0 10px rgba(34, 211, 238, 0.8)' : 'none'
                     }}
                     transition={{ repeat: isNoteMatch ? Infinity : 0, duration: 0.1 }}
                     style={{
                       width: `${2 + (5-i)*0.5}px`,
                       height: '100%',
                       borderRadius: '2px',
                       background: isOutdoorMode ? '#000' : 'linear-gradient(to bottom, #71717A, #E2E8F0, #71717A)',
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
                    borderColor: isActive ? 'var(--color-accent)' : 'var(--glass-border)',
                    backgroundColor: isActive ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 800,
                    color: isActive ? 'var(--color-accent)' : 'var(--text-secondary)',
                  }}
                >
                  {s.replace(/\d+$/, '')}
                </motion.button>
              </div>
            );
          })}
        </div>
        
        <div 
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
          onClick={() => setIsAutoMode(!isAutoMode)}
        >
          <span className="label-text" style={{ fontSize: '10px' }}>AUTO</span>
          <div className="glass-pill" style={{ width: '44px', height: '24px', padding: '3px', display: 'flex', alignItems: 'center', justifyContent: isAutoMode ? 'flex-start' : 'flex-end', cursor: 'pointer' }}>
            <motion.div layout transition={{ type: "spring", stiffness: 500, damping: 30 }} style={{ width: '16px', height: '16px', backgroundColor: isAutoMode ? 'var(--color-accent)' : 'var(--text-secondary)', borderRadius: '50%' }} />
          </div>
          <span className="label-text" style={{ fontSize: '10px', opacity: !isAutoMode ? 1 : 0.5 }}>MANUAL</span>
        </div>
      </div>

      <InstrumentBS isOpen={isBSOpen} onClose={() => setIsBSOpen(false)} />
    </div>
  );
};
