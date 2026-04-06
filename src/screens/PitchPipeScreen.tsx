import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, HelpCircle, RefreshCcw, Music, Play } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { usePitchPipe } from '../hooks/usePitchPipe';

/**
 * PitchPipeScreen - Pro Suite V3.3.1
 * Features: Ear Training Challenge, High-Contrast Adaptation, Note Resonance.
 */

export const PitchPipeScreen: React.FC = () => {
  const { activeTuning, a4Calibration, isOutdoorMode, theme, earTrainingScore, updateEarTrainingScore } = useAppContext();
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
    // Longer play duration for better training
    setTimeout(() => stopNote(), 2500); 
  };

  const handleGuess = (note: string) => {
    if (gameState !== 'playing') return;
    const isCorrect = note === targetNote;
    setGuessResult(isCorrect);
    setGameState('result');
    if (isCorrect) updateEarTrainingScore(earTrainingScore + 1);
  };

  const currentTheme = isOutdoorMode ? 'outdoor' : theme;

  return (
    <div className="screen-container" data-theme={currentTheme} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* 1. Pro Header & Stats */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
        <div className="glass-pill" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', border: '1px solid var(--glass-border)' }}>
           <Trophy size={14} color="var(--color-warning)" />
           <span className="label-text" style={{ fontSize: '10px' }}>SCORE: {earTrainingScore}</span>
        </div>
        
        {gameState !== 'idle' && (
          <button 
            onClick={() => setGameState('idle')}
            className="glass-pill"
            style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}
          >
            <RefreshCcw size={14} />
            <span className="label-text" style={{ fontSize: '10px' }}>ABORT</span>
          </button>
        )}
      </div>

      {/* 2. Central Challenge Dashboard */}
      <div style={{ width: '100%', height: '160px', marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AnimatePresence mode="wait">
          {gameState === 'idle' && (
            <motion.div key="idle" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center' }}>
               <div style={{ background: 'var(--tab-indicator-bg)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <HelpCircle size={32} color="var(--color-accent)" />
               </div>
               <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>Musical Ear Training</h3>
               <button 
                 onClick={startGame} 
                 className="glass-premium"
                 style={{ padding: '8px 24px', borderRadius: '12px', fontSize: '13px', fontWeight: 800, color: 'var(--color-accent)', border: '1px solid var(--color-accent)' }}
               >
                 BEGIN CHALLENGE
               </button>
            </motion.div>
          )}
          
          {gameState === 'playing' && (
            <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center' }}>
               <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', justifyContent: 'center' }}>
                  {[1,2,3,4].map(i => (
                    <motion.div key={i} animate={{ scale: [1, 1.3, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, delay: i * 0.15 }} style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-accent)' }} />
                  ))}
               </div>
               <p className="label-text" style={{ fontSize: '11px', color: 'var(--text-primary)' }}>IDENTIFY THE RESONANCE</p>
            </motion.div>
          )}
          
          {gameState === 'result' && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
               <h2 style={{ fontSize: '36px', fontWeight: 800, color: guessResult ? 'var(--color-success)' : 'var(--color-danger)', marginBottom: '4px' }}>
                 {guessResult ? 'PERFECT!' : 'STRIKE!'}
               </h2>
               <p className="label-text" style={{ fontSize: '10px' }}>
                 Expected: <span style={{ color: 'var(--color-accent)' }}>{targetNote?.replace(/\d/,'')}</span>
               </p>
               <button 
                 onClick={startGame} 
                 className="glass-pill"
                 style={{ marginTop: '20px', padding: '10px 24px', fontSize: '12px', fontWeight: 800, backgroundColor: 'var(--tab-indicator-bg)', border: '1px solid var(--glass-border)' }}
               >
                 NEXT ROUND
               </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. The Interactive Note Grid */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', width: '100%', marginTop: '20px' }}>
        {activeTuning.notes.map((note) => {
          const isActive = activeNote === note;
          const isTarget = gameState === 'result' && note === targetNote;
          
          return (
            <motion.button
              key={note}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                if (gameState === 'playing') handleGuess(note);
                else playNote(note);
              }}
              className={isActive ? 'neon-glow-cyan' : 'glass-premium'}
              style={{
                position: 'relative',
                height: '110px',
                borderRadius: '20px',
                border: '1px solid',
                borderColor: isActive ? 'var(--color-accent)' : (isTarget ? 'var(--color-success)' : 'var(--glass-border)'),
                backgroundColor: isActive ? 'rgba(34, 211, 238, 0.1)' : 'var(--bg-card)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span style={{ fontSize: '42px', fontWeight: 800, color: isActive ? 'var(--color-accent)' : 'var(--text-primary)', lineHeight: 1 }}>
                {note.replace(/\d+/, '')}
              </span>
              <span className="label-text" style={{ fontSize: '8px', opacity: 0.4 }}>Hz: {Math.round(440 * Math.pow(2, ((note === 'E4' ? 64 : 60) - 69) / 12))}</span>
            </motion.button>
          );
        })}
      </div>

      {/* 4. Functional Footer Status */}
      <div style={{ padding: '20px', width: '100%', marginBottom: '20px' }}>
         <motion.button 
            whileTap={{ scale: 0.98 }}
            onClick={gameState === 'idle' ? startGame : undefined}
            className="glass-premium neon-glow-cyan" 
            style={{ 
              padding: '16px 24px', 
              width: '100%',
              borderRadius: '16px',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '12px',
              border: gameState === 'idle' ? '1px solid var(--color-accent)' : '1px solid var(--glass-border)',
              backgroundColor: gameState === 'idle' ? 'rgba(34, 211, 238, 0.05)' : 'transparent'
            }}
         >
            {gameState === 'idle' ? <Play size={18} color="var(--color-accent)" /> : <Music size={18} color="var(--color-accent)" />}
            <span className="label-text" style={{ fontSize: '10px', color: 'var(--text-primary)' }}>
              {activeNote ? `RESONATING: ${activeNote}` : (gameState === 'idle' ? 'READY FOR TRAINING - TAP TO START' : 'LISTEN CAREFULLY...')}
            </span>
         </motion.button>
      </div>
    </div>
  );
};
