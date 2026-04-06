import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TunerGauge } from '../components/TunerGauge';
import { ChevronDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { InstrumentBS } from '../components/InstrumentBS';
import { useTuner } from '../hooks/useTuner';

export const TunerScreen: React.FC = () => {
  const { activeTuning, selectedInstrument, a4Calibration } = useAppContext();
  const { 
    note, 
    cents, 
    isDetecting, 
    startTuning, 
    stopTuning 
  } = useTuner(a4Calibration);
  
  const [isBSOpen, setIsBSOpen] = useState(false);

  const toggleListening = () => {
    if (isDetecting) stopTuning();
    else startTuning();
  };

  const status = !isDetecting ? 'idle' : (Math.abs(cents) < 5 ? 'perfect' : 'detecting');


  return (
    <div className="screen-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Header */}
      <button 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 20px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          marginTop: '20px',
        }}
        onClick={() => setIsBSOpen(true)}
      >
        <div style={{ textAlign: 'left' }}>
          <p className="label-text" style={{ fontSize: '10px', marginBottom: '2px' }}>{selectedInstrument}</p>
          <p style={{ fontWeight: 600, fontSize: '14px' }}>{activeTuning.name}</p>
        </div>
        <ChevronDown size={20} color="var(--text-secondary)" />
      </button>

      {/* Main Tuner Area */}
      <div 
        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', cursor: 'pointer' }}
        onClick={toggleListening}
      >
        <TunerGauge 
          cents={cents} 
          status={status === 'idle' ? 'idle' : (Math.abs(cents) < 5 ? 'perfect' : 'detecting')} 
          note={status === 'idle' ? '--' : (note || 'E')} 
        />
      </div>

      {/* Footer / strings */}
      <div style={{ width: '100%', marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          {activeTuning.notes.map((s, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.9 }}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text-secondary)',
              }}
            >
              {s.charAt(0)}
            </motion.button>
          ))}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <span className="label-text">Auto</span>
          <div style={{
            width: '48px',
            height: '24px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer'
          }}>
            <motion.div style={{
              width: '20px',
              height: '20px',
              backgroundColor: 'var(--color-accent)',
              borderRadius: '50%',
            }} />
          </div>
          <span className="label-text" style={{ opacity: 0.5 }}>Manual</span>
        </div>
      </div>

      <InstrumentBS isOpen={isBSOpen} onClose={() => setIsBSOpen(false)} />
    </div>
  );
};
