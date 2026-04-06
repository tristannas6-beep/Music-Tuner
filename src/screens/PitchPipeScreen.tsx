import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { usePitchPipe } from '../hooks/usePitchPipe';

/**
 * PitchPipeScreen - Elite Edition v2.0
 * Features: 3D-grid layout, Liquid Glow active notes, and high-fidelity typography.
 */

export const PitchPipeScreen: React.FC = () => {
  const { activeTuning, a4Calibration } = useAppContext();
  const { activeNote, playNote } = usePitchPipe(a4Calibration);

  return (
    <div className="screen-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Header Info */}
      <header style={{ marginTop: '20px', textAlign: 'center', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
          <div className="glass-pill" style={{ padding: '6px 16px' }}>
            <span className="label-text" style={{ fontSize: '10px' }}>Pitch Reference</span>
          </div>
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'white' }}>{activeTuning.name} Tuning</h2>
      </header>

      {/* 3D Grid Layout */}
      <div style={{ 
        flex: 1, 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '24px', 
        width: '100%', 
        padding: '30px 0',
        alignContent: 'center'
      }}>
        {activeTuning.notes.map((note) => {
          const isActive = activeNote === note;
          return (
            <motion.button
              key={note}
              whileTap={{ scale: 0.94 }}
              onClick={() => playNote(note)}
              className={isActive ? 'neon-glow-cyan' : 'glass-premium'}
              style={{
                position: 'relative',
                height: '160px',
                borderRadius: '28px',
                border: '1px solid',
                borderColor: isActive ? 'var(--color-accent)' : 'rgba(255, 255, 255, 0.05)',
                backgroundColor: isActive ? 'rgba(34, 211, 238, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                overflow: 'hidden'
              }}
            >
              {/* Liquid Glow FX */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 1 }}
                    exit={{ scale: 2, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      background: 'radial-gradient(circle, rgba(34, 211, 238, 0.2) 0%, transparent 70%)',
                      zIndex: 0
                    }}
                  />
                )}
              </AnimatePresence>

              <span style={{ 
                fontSize: '56px', 
                fontWeight: 800, 
                color: isActive ? 'var(--color-accent)' : 'white',
                zIndex: 1,
                lineHeight: 1
              }}>
                {note.replace(/\d+/, '')}
              </span>
              <span className="label-text" style={{ 
                color: isActive ? 'white' : 'var(--text-secondary)',
                opacity: isActive ? 0.9 : 0.6,
                zIndex: 1,
                marginTop: '4px',
                fontSize: '10px'
              }}>
                Octave {note.match(/\d+/)?.[0]}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Active State / Feedback */}
      <motion.div 
        animate={{ opacity: activeNote ? 1 : 0.4 }}
        style={{ 
          textAlign: 'center', 
          padding: '20px', 
          width: '100%',
          marginBottom: '20px'
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 24px', borderRadius: '40px' }} className="glass-premium">
           <div style={{ 
             width: '8px', 
             height: '8px', 
             borderRadius: '50%', 
             backgroundColor: activeNote ? 'var(--color-accent)' : 'var(--text-secondary)',
             boxShadow: activeNote ? '0 0 10px var(--color-accent)' : 'none'
           }} />
           <span className="label-text" style={{ fontSize: '10px' }}>
             {activeNote ? `Resonating: ${activeNote}` : 'Reference Signal Offline'}
           </span>
        </div>
      </motion.div>
    </div>
  );
};
