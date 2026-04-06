import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Plus, Minus } from 'lucide-react';
import { useMetronome } from '../hooks/useMetronome';

export const MetronomeScreen: React.FC = () => {
  const { 
    bpm, 
    setBpm, 
    isPlaying, 
    toggleMetronome, 
    currentBeat, 
    tapTempo 
  } = useMetronome();

  const getTempoText = (bpm: number) => {
    if (bpm < 60) return 'Largo';
    if (bpm < 76) return 'Adagio';
    if (bpm < 108) return 'Andante';
    if (bpm < 120) return 'Moderato';
    if (bpm < 156) return 'Allegro';
    if (bpm < 176) return 'Vivace';
    return 'Presto';
  };

  return (
    <div className="screen-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '120px' }}>
      
      {/* Visualizer Dots */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '60px' }}>
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              scale: currentBeat === i && isPlaying ? 1.6 : 1,
              backgroundColor: currentBeat === i && isPlaying ? (i === 0 ? 'var(--color-danger)' : 'var(--color-success)') : 'rgba(255, 255, 255, 0.1)',
              boxShadow: currentBeat === i && isPlaying ? `0 0 20px ${i === 0 ? 'var(--color-danger)' : 'var(--color-success)'}` : 'none',
            }}
            style={{ width: '12px', height: '12px', borderRadius: '50%' }}
          />
        ))}
      </div>

      {/* BPM Display */}
      <div style={{ textAlign: 'center' }}>
        <motion.h1 
          className="huge-text"
          animate={{ scale: isPlaying && currentBeat === 0 ? 1.05 : 1 }}
          transition={{ duration: 0.1 }}
        >
          {bpm}
        </motion.h1>
        <p className="label-text" style={{ fontSize: '18px', marginTop: '4px' }}>{getTempoText(bpm)}</p>
      </div>

      {/* Controls */}
      <div style={{ width: '100%', maxWidth: '300px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
          <button 
            onClick={() => setBpm(b => Math.max(30, b - 1))}
            className="glass"
            style={{ width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Minus size={24} />
          </button>

          <button 
            onClick={tapTempo}
            className="glass"
            style={{ 
              padding: '12px 24px', 
              borderRadius: '24px', 
              fontSize: '14px', 
              fontWeight: 600,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Tap Tempo
          </button>

          <button 
            onClick={() => setBpm(b => Math.min(300, b + 1))}
            className="glass"
            style={{ width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Plus size={24} />
          </button>
        </div>

        {/* Big Play Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleMetronome}
          style={{
            width: '100%',
            height: '80px',
            borderRadius: '40px',
            backgroundColor: isPlaying ? 'var(--color-danger)' : 'var(--color-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 800,
            fontSize: '20px',
            gap: '12px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {isPlaying ? <Pause fill="white" size={32} /> : <Play fill="white" size={32} />}
          {isPlaying ? 'STOP' : 'START'}
        </motion.button>
      </div>
    </div>
  );
};
