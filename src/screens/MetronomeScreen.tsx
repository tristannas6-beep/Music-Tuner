import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ListMusic, Save, Trash2 } from 'lucide-react';
import { useMetronome, type Subdivision } from '../hooks/useMetronome';
import { useAppContext } from '../context/AppContext';

/**
 * MetronomeScreen - Pro Suite V3.3.0
 * Features: Setlist Management, Pulsed Haptics, Outdoor Mode, Circular Dial.
 */

export const MetronomeScreen: React.FC = () => {
  const { 
    hapticsEnabled, 
    isOutdoorMode, 
    metronomeSetlist, 
    saveMetronomePreset, 
    deleteMetronomePreset,
    theme
  } = useAppContext();

  const { 
    bpm, setBpm, 
    isPlaying, toggleMetronome, 
    currentBeat, 
    subdivision, setSubdivision,
    tapTempo 
  } = useMetronome(hapticsEnabled);

  const [isTapping, setIsTapping] = useState(false);
  const [showSetlist, setShowSetlist] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const dialRef = useRef<HTMLDivElement>(null);

  const handleDialDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dialRef.current) return;
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const angle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI) + 180;
    const newBpm = Math.floor(30 + (angle / 360) * 270);
    setBpm(newBpm);
  };

  const onSavePreset = () => {
    if (!newPresetName.trim()) return;
    saveMetronomePreset({
      name: newPresetName,
      bpm: bpm,
      subdivision: subdivision
    });
    setNewPresetName('');
  };

  const subdivisions: Subdivision[] = ['1/4', '1/8', 'Triplet', '1/16'];

  const currentTheme = isOutdoorMode ? 'outdoor' : theme;

  return (
    <div className="screen-container" data-theme={currentTheme} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* 1. Rhythm Indicator */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '30px' }}>
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              opacity: currentBeat === i && isPlaying ? 1 : 0.2,
              scale: currentBeat === i && isPlaying ? 1.2 : 1,
              backgroundColor: currentBeat === i && isPlaying ? 'var(--color-accent)' : 'var(--text-secondary)'
            }}
            className={currentBeat === i && isPlaying && !isOutdoorMode ? 'neon-glow-cyan' : ''}
            style={{ width: '40px', height: '6px', borderRadius: '3px' }}
          />
        ))}
      </div>

      {/* 2. BPM CENTERPIECE */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', position: 'relative' }}>
        <div 
          ref={dialRef}
          style={{ position: 'relative', width: '260px', height: '260px', cursor: 'grab' }}
          onMouseMove={(e) => e.buttons === 1 && handleDialDrag(e)}
          onTouchMove={handleDialDrag}
        >
          <svg width="260" height="260" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
            <circle cx="130" cy="130" r="120" fill="none" stroke="var(--glass-border)" strokeWidth="6" />
            <motion.circle
              cx="130" cy="130" r="120"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="6"
              strokeDasharray="754" 
              animate={{ strokeDashoffset: 754 * (1 - (bpm - 30) / 270) }}
            />
          </svg>

          <div className="glass-premium" style={{ position: 'absolute', inset: '15px', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)' }}>
             <span className="label-text" style={{ fontSize: '10px' }}>PRO TEMPO</span>
             <h1 className="huge-text" style={{ fontSize: '72px', color: 'var(--text-primary)' }}>{bpm}</h1>
             <span className="label-text" style={{ fontSize: '12px', color: 'var(--color-accent)' }}>BPM</span>
          </div>
        </div>
      </div>

      {/* 3. PRO CONTROLS */}
      <div style={{ width: '100%', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Setlist Toggler & Actions */}
        <div style={{ display: 'flex', gap: '12px' }}>
           <div className="glass-pill" style={{ flex: 1, display: 'flex', padding: '4px', height: '48px', alignItems: 'center' }}>
              <input 
                placeholder="Preset Name..." 
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                style={{ flex: 1, background: 'none', border: 'none', color: 'white', padding: '0 16px', outline: 'none', fontSize: '13px' }} 
              />
              <button 
                onClick={onSavePreset}
                style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Save size={18} color={isOutdoorMode ? 'white' : 'black'} />
              </button>
           </div>
           <button 
             onClick={() => setShowSetlist(!showSetlist)}
             className="glass-pill"
             style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderColor: showSetlist ? 'var(--color-accent)' : 'var(--glass-border)' }}
           >
              <ListMusic size={20} color={showSetlist ? 'var(--color-accent)' : 'var(--text-secondary)'} />
           </button>
        </div>

        {/* Expandable Setlist */}
        <AnimatePresence>
          {showSetlist && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="glass-premium"
              style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}
            >
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                {metronomeSetlist.length === 0 && <p className="label-text" style={{ textAlign: 'center', padding: '20px' }}>No Presets Saved</p>}
                {metronomeSetlist.map((preset) => (
                  <div key={preset.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.03)' }}>
                    <div onClick={() => { setBpm(preset.bpm); setSubdivision(preset.subdivision as any); }}>
                       <p style={{ fontWeight: 600, fontSize: '14px' }}>{preset.name}</p>
                       <p className="label-text" style={{ fontSize: '10px' }}>{preset.bpm} BPM • {preset.subdivision}</p>
                    </div>
                    <button onClick={() => deleteMetronomePreset(preset.id)} style={{ color: 'var(--color-danger)', opacity: 0.5 }}><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subdivision & Playback */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="glass-pill" style={{ flex: 1, height: '48px', display: 'flex', padding: '4px' }}>
            {subdivisions.map(s => (
               <button 
                 key={s} 
                 onClick={() => setSubdivision(s)}
                 style={{ flex: 1, borderRadius: '20px', fontSize: '10px', fontWeight: 700, backgroundColor: subdivision === s ? 'var(--color-accent)' : 'transparent', color: subdivision === s ? (isOutdoorMode ? 'white' : 'black') : 'var(--text-secondary)' }}
               >
                 {s}
               </button>
            ))}
          </div>
          <button 
            onClick={() => { tapTempo(); setIsTapping(true); setTimeout(() => setIsTapping(false), 150); }}
            className="glass-pill"
            style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderColor: isTapping ? 'var(--color-accent)' : 'var(--glass-border)' }}
          >
             <span className="label-text" style={{ fontSize: '10px' }}>TAP</span>
          </button>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={toggleMetronome}
          className={isPlaying ? '' : 'neon-glow-cyan'}
          style={{
            width: '100%',
            height: '64px',
            borderRadius: '20px',
            backgroundColor: isPlaying ? 'rgba(244, 63, 94, 0.1)' : 'var(--color-accent)',
            border: isPlaying ? '2px solid var(--color-danger)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
          }}
        >
          {isPlaying ? <Pause color="var(--color-danger)" fill="var(--color-danger)" /> : <Play color={isOutdoorMode ? 'white' : 'black'} fill={isOutdoorMode ? 'white' : 'black'} />}
          <span style={{ fontWeight: 800, color: isPlaying ? 'var(--color-danger)' : (isOutdoorMode ? 'white' : 'black') }}>
            {isPlaying ? 'STOP' : 'START PRO SESSION'}
          </span>
        </motion.button>
      </div>
    </div>
  );
};
