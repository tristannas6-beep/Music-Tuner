import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, HelpCircle, RefreshCcw, Music } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { usePitchPipe } from '../hooks/usePitchPipe';

/**
 * PitchPipeScreen - Pro Suite V3.3.0
 * Features: Ear Training Mini-Game, High-Contrast Outdoor Mode, 3D Pitch Reference.
 */

export const PitchPipeScreen: React.FC = () => {
  const { activeTuning, a4Calibration, isOutdoorMode, earTrainingScore, updateEarTrainingScore } = useAppContext();
  const { activeNote, playNote, stopNote } = usePitchPipe(a4Calibration);

  // Ear Training State
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'result'>('idle');
  const [targetNote, setTargetNote] = useState<string | null>(null);
  const [guessResult, setGuessResult] = useState<boolean | null>(null);

  const startGame = () => {
    const randomNote = activeTuning.notes[Math.floor(Math.random() * activeTuning.notes.length)];
    setTargetNote(randomNote);
    setGuessResult(null);
    setGameState('playing');
    playNote(randomNote);
    setTimeout(() => stopNote(), 2000); // Play for 2 seconds
  };

  const handleGuess = (note: string) => {
    if (gameState !== 'playing') return;
    const isCorrect = note === targetNote;
    setGuessResult(isCorrect);
    setGameState('result');
    if (isCorrect) updateEarTrainingScore(earTrainingScore + 1);
  };

  return (
    <div className="screen-container" data-theme={isOutdoorMode ? 'outdoor' : 'dark'} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* 1. Header & Scoreboard */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
        <div className="glass-pill" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 16px' }}>
           <Trophy size={14} color="var(--color-warning)" />
           <span className="label-text" style={{ fontSize: '10px' }}>SCORE: {earTrainingScore}</span>
        </div>
        <button 
          onClick={startGame}
          className="glass-pill"
          style={{ padding: '6px 16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-accent)' }}
        >
          <RefreshCcw size={14} />
          <span className="label-text" style={{ fontSize: '10px' }}>NEW GAME</span>
        </button>
      </div>

      {/* 2. Ear Training Challenge Area */}
      <div style={{ width: '100%', height: '140px', marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AnimatePresence mode="wait">
          {gameState === 'idle' && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center' }}>
               <HelpCircle size={48} color="var(--text-secondary)" style={{ opacity: 0.3, marginBottom: '12px' }} />
               <p className="label-text" style={{ fontSize: '12px' }}>Improve your musical ear</p>
               <button onClick={startGame} style={{ marginTop: '12px', fontSize: '14px', fontWeight: 800, color: 'var(--color-accent)' }}>BEGIN TEST</button>
            </motion.div>
          )}
          {gameState === 'playing' && (
            <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center' }}>
               <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                  {[1,2,3].map(i => (
                    <motion.div key={i} animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, delay: i * 0.2 }} style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-accent)' }} />
                  ))}
               </div>
               <p className="label-text">Select the note you heard</p>
            </motion.div>
          )}
          {gameState === 'result' && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
               <h2 style={{ fontSize: '32px', fontWeight: 800, color: guessResult ? 'var(--color-success)' : 'var(--color-danger)' }}>
                 {guessResult ? 'CORRECT!' : 'WRONG'}
               </h2>
               <p className="label-text" style={{ marginTop: '8px' }}>Target was: {targetNote?.replace(/\d/,'')}</p>
               <button 
                 onClick={startGame} 
                 className="glass-pill"
                 style={{ marginTop: '16px', padding: '8px 20px', fontSize: '12px', fontWeight: 700, backgroundColor: 'rgba(255,255,255,0.05)' }}
               >
                 TRY ANOTHER
               </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. The 3D Note Grid */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', width: '100%', marginTop: '20px' }}>
        {activeTuning.notes.map((note) => {
          const isActive = activeNote === note;
          return (
            <motion.button
              key={note}
              whileTap={{ scale: 0.94 }}
              onClick={() => {
                if (gameState === 'playing') handleGuess(note);
                else playNote(note);
              }}
              className={isActive && !isOutdoorMode ? 'neon-glow-cyan' : 'glass-premium'}
              style={{
                position: 'relative',
                height: '140px',
                borderRadius: '24px',
                border: '1px solid',
                borderColor: isActive ? 'var(--color-accent)' : 'var(--glass-border)',
                backgroundColor: isActive ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                overflow: 'hidden'
              }}
            >
              <span style={{ fontSize: '48px', fontWeight: 800, color: isActive ? 'var(--color-accent)' : 'var(--text-primary)', zIndex: 1, lineHeight: 1 }}>
                {note.replace(/\d+/, '')}
              </span>
              <span className="label-text" style={{ fontSize: '9px', opacity: 0.5 }}>Octave {note.match(/\d+/)?.[0]}</span>
            </motion.button>
          );
        })}
      </div>

      <div style={{ padding: '20px', width: '100%', marginBottom: '20px' }}>
         <div className="glass-pill" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <Music size={16} color="var(--color-accent)" />
            <span className="label-text" style={{ fontSize: '10px' }}>
              {activeNote ? `RESONATING: ${activeNote}` : 'READY FOR TRAINING'}
            </span>
         </div>
      </div>
    </div>
  );
};
