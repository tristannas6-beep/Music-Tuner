import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Music2, Layers } from 'lucide-react';
import { useMetronome, Subdivision, SoundProfile } from '../hooks/useMetronome';

/**
 * MetronomeScreen - Elite Edition v2.0
 * Features: Circular BPM Dial, Radial Progress, Subdivisions, Sound Profiles.
 */

export const MetronomeScreen: React.FC = () => {
  const { 
    bpm, setBpm, 
    isPlaying, toggleMetronome, 
    currentBeat, currentSub,
    subdivision, setSubdivision,
    soundProfile, setSoundProfile,
    tapTempo 
  } = useMetronome();

  const [isTapping, setIsTapping] = useState(false);
  const [dialAngle, setDialAngle] = useState(0);
  const dialRef = useRef<HTMLDivElement>(null);

  // BPM Dial Physics: Dragging logic simplified for React
  const handleDialDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dialRef.current) return;
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const angle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI) + 180;
    setDialAngle(angle);
    
    // Scale angle (0-360) to BPM (30-300)
    const newBpm = Math.floor(30 + (angle / 360) * 270);
    setBpm(newBpm);
  };

  const subdivisions: Subdivision[] = ['1/4', '1/8', 'Triplet', '1/16'];
  const soundProfiles: SoundProfile[] = ['Digital', 'Wood', 'Cowbell'];

  return (
    <div className="screen-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* 1. RHYTHM INDICATOR */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '30px' }}>
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              opacity: currentBeat === i && isPlaying ? 1 : 0.2,
              scale: currentBeat === i && isPlaying ? 1.2 : 1,
              backgroundColor: currentBeat === i && isPlaying ? 'var(--color-accent)' : 'var(--text-secondary)'
            }}
            className={currentBeat === i && isPlaying ? 'neon-glow-cyan' : ''}
            style={{ width: '40px', height: '6px', borderRadius: '3px' }}
          />
        ))}
      </div>

      {/* 2. BPM CENTERPIECE: CIRCULAR DIAL */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', position: 'relative' }}>
        <div 
          ref={dialRef}
          style={{ position: 'relative', width: '280px', height: '280px', cursor: 'pointer' }}
          onMouseMove={(e) => e.buttons === 1 && handleDialDrag(e)}
          onTouchMove={handleDialDrag}
        >
          {/* Radial Progress Track */}
          <svg width="280" height="280" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
            <circle cx="140" cy="140" r="130" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
            
            {/* Real-time Beat Pulse */}
            <motion.circle
              cx="140" cy="140" r="130"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="6"
              strokeDasharray="816" // 2 * PI * 130
              animate={{ 
                strokeDashoffset: 816 * (1 - (bpm - 30) / 270),
                opacity: isPlaying ? [0.4, 1, 0.4] : 0.6
              }}
              className="neon-glow-cyan"
            />
          </svg>

          {/* Center Glass Display */}
          <motion.div 
            animate={{ scale: isPlaying && currentBeat === 0 ? 1.05 : 1 }}
            className="glass-premium"
            style={{
              position: 'absolute',
              inset: '20px',
              borderRadius: '50%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: '2px',
              borderColor: 'rgba(34, 211, 238, 0.2)'
            }}
          >
             <span className="label-text" style={{ fontSize: '10px' }}>EST. TEMPO</span>
             <h1 className="huge-text" style={{ fontSize: '80px', margin: '4px 0' }}>{bpm}</h1>
             <span className="label-text" style={{ fontSize: '12px', color: 'var(--color-accent)' }}>BPM</span>
          </motion.div>
          
          {/* Circular Playback Notch */}
          <motion.div 
            style={{
               position: 'absolute',
               width: '12px',
               height: '12px',
               backgroundColor: 'white',
               borderRadius: '50%',
               top: '140px',
               left: '140px',
               marginTop: '-136px',
               marginLeft: '-6px',
               transformOrigin: '6px 140px'
            }}
            animate={{ rotate: (bpm - 30) / 270 * 360 }}
            className="neon-glow-cyan"
          />
        </div>
      </div>

      {/* 3. PRO CONTROLS: SUBDIVISIONS & SOUND */}
      <div style={{ width: '100%', marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Subdivision Selector */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
             <Layers size={14} className="label-text" />
             <span className="label-text">Subdivisions</span>
          </div>
          <div className="glass-pill" style={{ display: 'flex', padding: '4px', gap: '4px' }}>
            {subdivisions.map((s) => (
              <button
                key={s}
                onClick={() => setSubdivision(s)}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: subdivision === s ? 'rgba(34, 211, 238, 0.2)' : 'transparent',
                  color: subdivision === s ? 'var(--color-accent)' : 'var(--text-secondary)',
                  transition: 'all 0.3s'
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Sound & Action Area */}
        <div style={{ display: 'flex', gap: '16px' }}>
          
          {/* Sound Profile */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
               <Music2 size={14} className="label-text" />
               <span className="label-text">Sound</span>
            </div>
            <div className="glass-premium" style={{ borderRadius: '20px', display: 'flex', padding: '4px', gap: '4px', borderWidth: '1px' }}>
              {soundProfiles.map((p) => (
                <button
                  key={p}
                  onClick={() => setSoundProfile(p)}
                  style={{
                    flex: 1,
                    padding: '10px 0',
                    borderRadius: '16px',
                    fontSize: '10px',
                    fontWeight: 700,
                    backgroundColor: soundProfile === p ? 'var(--text-primary)' : 'transparent',
                    color: soundProfile === p ? 'black' : 'var(--text-secondary)',
                    transition: 'all 0.3s'
                  }}
                >
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Elegant TAP Button */}
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => { tapTempo(); setIsTapping(true); setTimeout(() => setIsTapping(false), 200); }}
            className="glass-premium"
            style={{ 
              width: '100px', 
              borderRadius: '20px', 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              borderWidth: '2px',
              borderColor: isTapping ? 'var(--color-accent)' : 'var(--glass-border)'
            }}
          >
            <span className="label-text" style={{ fontSize: '10px' }}>TAP</span>
            <div style={{ width: '20px', height: '2px', backgroundColor: isTapping ? 'var(--color-accent)' : 'var(--glass-border)', marginTop: '4px' }} />
          </motion.button>

        </div>

        {/* 4. MASTER PLAYBACK */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={toggleMetronome}
          className={isPlaying ? 'glass-premium' : 'neon-glow-cyan'}
          style={{
            width: '100%',
            height: '74px',
            borderRadius: '24px',
            backgroundColor: isPlaying ? 'rgba(244, 63, 94, 0.1)' : 'var(--color-accent)',
            border: isPlaying ? '2px solid var(--color-danger)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            cursor: 'pointer'
          }}
        >
          {isPlaying ? (
            <Pause fill="var(--color-danger)" size={32} color="var(--color-danger)" />
          ) : (
            <Play fill="white" size={32} color="white" />
          )}
          <span style={{ 
            fontSize: '20px', 
            fontWeight: 800, 
            letterSpacing: '0.1em',
            color: isPlaying ? 'var(--color-danger)' : 'white' 
          }}>
            {isPlaying ? 'STOP' : 'START SESSION'}
          </span>
        </motion.button>

      </div>
    </div>
  );
};
