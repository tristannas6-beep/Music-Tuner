import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { usePitchPipe } from '../hooks/usePitchPipe';

export const PitchPipeScreen: React.FC = () => {
  const { activeTuning, a4Calibration } = useAppContext();
  const { activeNote, playNote } = usePitchPipe(a4Calibration);

  return (
    <div className="screen-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <header style={{ marginTop: '20px', textAlign: 'center' }}>
        <p className="label-text">Pitch Pipe</p>
        <h2 style={{ fontSize: '24px', fontWeight: 600 }}>{activeTuning.name} Tuning</h2>
      </header>

      <div style={{ 
        flex: 1, 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '20px', 
        width: '100%', 
        padding: '40px 0',
        alignContent: 'center'
      }}>
        {activeTuning.notes.map((note) => {
          const isActive = activeNote === note;
          return (
            <button
              key={note}
              onClick={() => playNote(note)}
              style={{
                position: 'relative',
                height: '140px',
                borderRadius: '24px',
                backgroundColor: isActive ? 'var(--color-accent)' : 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.3s ease',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <AnimatePresence>
                {isActive && (
                  <>
                    {/* Radiating Waves */}
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 1, opacity: 0.5 }}
                        animate={{ scale: 1.8, opacity: 0 }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 2, 
                          delay: i * 0.6,
                          ease: "easeOut" 
                        }}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          borderRadius: '24px',
                          border: '2px solid var(--color-accent)',
                          zIndex: -1,
                        }}
                      />
                    ))}
                  </>
                )}
              </AnimatePresence>

              <span style={{ 
                fontSize: '48px', 
                fontWeight: 800, 
                color: isActive ? 'white' : 'var(--text-primary)' 
              }}>
                {note.replace(/\d+/, '')}
              </span>
              <span className="label-text" style={{ 
                color: isActive ? 'rgba(255,255,255,0.7)' : 'var(--text-secondary)' 
              }}>
                Octave {note.match(/\d+/)?.[0]}
              </span>
            </button>
          );
        })}
      </div>

      <p className="label-text" style={{ textAlign: 'center', padding: '20px', opacity: 0.6 }}>
        {activeNote ? `Playing ${activeNote}` : 'Tap a note to play reference tone'}
      </p>
    </div>
  );
};
