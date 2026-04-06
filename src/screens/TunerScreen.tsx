import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TunerGauge } from '../components/TunerGauge';
import { ChevronDown, Activity } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { InstrumentBS } from '../components/InstrumentBS';
import { useTuner } from '../hooks/useTuner';
import { WaveformVisualizer } from '../components/WaveformVisualizer';

export const TunerScreen: React.FC = () => {
  const { activeTuning, selectedInstrument, a4Calibration, noteNaming } = useAppContext();
  const { 
    note, 
    cents, 
    isDetecting, 
    startTuning, 
    stopTuning,
    analyser
  } = useTuner(a4Calibration, noteNaming);
  
  const [isBSOpen, setIsBSOpen] = useState(false);

  const toggleListening = () => {
    if (isDetecting) stopTuning();
    else startTuning();
  };

  const isPerfect = Math.abs(cents) < 3;
  const status = !isDetecting ? 'idle' : (isPerfect ? 'perfect' : 'detecting');

  return (
    <div className="screen-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Header / Tuning Selector */}
      <motion.button 
        whileTap={{ scale: 0.95 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 24px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          marginTop: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
        onClick={() => setIsBSOpen(true)}
      >
        <div style={{ textAlign: 'left' }}>
          <p className="label-text" style={{ fontSize: '10px', marginBottom: '2px', letterSpacing: '0.05em' }}>
            {selectedInstrument.toUpperCase()}
          </p>
          <p style={{ fontWeight: 700, fontSize: '15px' }}>{activeTuning.name}</p>
        </div>
        <ChevronDown size={18} color="var(--text-secondary)" />
      </motion.button>

      {/* Main Tuner Area */}
      <div 
        style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', cursor: 'pointer' }}
        onClick={toggleListening}
      >
        <TunerGauge 
          cents={cents} 
          status={status} 
          note={status === 'idle' ? '--' : note} 
        />
        
        {/* Real-time Oscilloscope */}
        <div style={{ width: '80%', marginTop: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', opacity: 0.4 }}>
             <Activity size={12} />
             <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em' }} className="label-text">
               REAL-TIME ANALYTICS
             </span>
          </div>
          <WaveformVisualizer 
            analyser={analyser} 
            isDetecting={isDetecting} 
            color={isDetecting ? (isPerfect ? '#2ECC40' : '#0074D9') : 'rgba(255,255,255,0.1)'} 
          />
        </div>
      </div>

      {/* Footer / String Reference */}
      <div style={{ width: '100%', marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
          {activeTuning.notes.map((s, i) => (
            <motion.div
              key={i}
              initial={false}
              animate={{
                borderColor: note.startsWith(s.charAt(0)) ? 'var(--color-accent)' : 'rgba(255, 255, 255, 0.1)',
                backgroundColor: note.startsWith(s.charAt(0)) ? 'rgba(0, 116, 217, 0.1)' : 'transparent',
              }}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                border: '2px solid',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 800,
                color: note.startsWith(s.charAt(0)) ? 'var(--color-accent)' : 'var(--text-secondary)',
                transition: 'all 0.3s ease'
              }}
            >
              {s.includes('#') ? s.substring(0, 2) : s.charAt(0)}
            </motion.div>
          ))}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <span className="label-text" style={{ fontSize: '11px' }}>AUTO MODE</span>
          <div style={{
            width: '40px',
            height: '20px',
            backgroundColor: 'var(--color-accent)',
            borderRadius: '10px',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            cursor: 'pointer'
          }}>
            <motion.div style={{
              width: '16px',
              height: '16px',
              backgroundColor: 'white',
              borderRadius: '50%',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }} />
          </div>
          <span className="label-text" style={{ opacity: 0.3, fontSize: '11px' }}>MANUAL</span>
        </div>
      </div>

      <InstrumentBS isOpen={isBSOpen} onClose={() => setIsBSOpen(false)} />
    </div>
  );
};
