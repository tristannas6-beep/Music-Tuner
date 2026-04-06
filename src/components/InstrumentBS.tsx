import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Share2, ArrowLeft } from 'lucide-react';
import { useAppContext, type InstrumentType, type TuningInfo } from '../context/AppContext';

/**
 * InstrumentBS - Pro Suite V3.3.0
 * Features: Custom Tuning Creator, Tuning Sharing, Extended Pro Library.
 */

interface InstrumentBSProps {
  isOpen: boolean;
  onClose: () => void;
}

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const InstrumentBS: React.FC<InstrumentBSProps> = ({ isOpen, onClose }) => {
  const { selectedInstrument, activeTuning, setInstrument, setTuning, isOutdoorMode } = useAppContext();
  const [view, setView] = useState<'list' | 'creator'>('list');
  
  // Creator State
  const [customName, setCustomName] = useState('My Custom');
  const [customNotes, setCustomNotes] = useState<string[]>(['E2', 'A2', 'D3', 'G3', 'B3', 'E4']);

  const handleShare = (tuning: TuningInfo) => {
    const code = `TUNER:${tuning.name}|${tuning.notes.join(',')}`;
    navigator.clipboard.writeText(window.location.origin + '?tuning=' + btoa(code));
    alert('Tuning link copied to clipboard!');
  };

  const onSaveCustom = () => {
    const newTuning: TuningInfo = { name: customName, notes: customNotes };
    setTuning(newTuning);
    onClose();
    setView('list');
  };

  const updateStringNote = (idx: number, delta: number) => {
    const newNotes = [...customNotes];
    const current = newNotes[idx];
    const notePart = current.match(/[A-Z]#?/)?.[0] || 'C';
    const octPart = parseInt(current.match(/\d+/)?.[0] || '4');
    
    let noteIdx = NOTES.indexOf(notePart) + delta;
    let newOct = octPart;
    
    if (noteIdx > 11) { noteIdx = 0; newOct++; }
    else if (noteIdx < 0) { noteIdx = 11; newOct--; }
    
    newNotes[idx] = `${NOTES[noteIdx]}${newOct}`;
    setCustomNotes(newNotes);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, backdropFilter: 'blur(4px)' }}
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            data-theme={isOutdoorMode ? 'outdoor' : 'dark'}
            style={{
              position: 'fixed',
              bottom: 0, left: 0, right: 0,
              backgroundColor: 'var(--bg-color)',
              borderTopLeftRadius: '32px',
              borderTopRightRadius: '32px',
              zIndex: 1001,
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              paddingBottom: 'var(--safe-area-bottom)',
              borderTop: '1px solid var(--glass-border)'
            }}
          >
            {/* Header */}
            <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {view === 'creator' && <ArrowLeft onClick={() => setView('list')} size={20} style={{ cursor: 'pointer' }} />}
                  <h2 style={{ fontSize: '20px', fontWeight: 800 }}>{view === 'list' ? 'Toolkit Library' : 'Custom Designer'}</h2>
               </div>
               <button onClick={onClose} className="glass-pill" style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <X size={18} />
               </button>
            </div>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              {view === 'list' ? (
                <>
                  {/* Instrument Sidebar */}
                  <div style={{ width: '100px', backgroundColor: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px 8px' }}>
                    {['Guitar', 'Bass', 'Ukulele', 'Violin'].map((inst) => (
                      <button
                        key={inst}
                        onClick={() => setInstrument(inst as any)}
                        style={{
                          padding: '12px 4px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 700,
                          backgroundColor: selectedInstrument === inst ? 'var(--color-accent)' : 'transparent',
                          color: selectedInstrument === inst ? (isOutdoorMode ? 'white' : 'black') : 'var(--text-secondary)',
                        }}
                      >
                        {inst.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  {/* Tuning Selection */}
                  <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {TUNINGS[selectedInstrument].map((t) => {
                          const isSelected = activeTuning.name === t.name;
                          return (
                            <div key={t.name} style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => { setTuning(t); onClose(); }}
                                className="glass-premium"
                                style={{
                                  flex: 1, padding: '16px', borderRadius: '16px', textAlign: 'left',
                                  borderColor: isSelected ? 'var(--color-accent)' : 'var(--glass-border)',
                                  borderWidth: isSelected ? '2px' : '1px'
                                }}
                              >
                                <p style={{ fontWeight: 700, fontSize: '14px' }}>{t.name}</p>
                                <p className="label-text" style={{ fontSize: '9px', opacity: 0.5 }}>{t.notes.join(' • ')}</p>
                              </button>
                              <button 
                                onClick={() => handleShare(t)}
                                className="glass-pill" 
                                style={{ width: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}
                              >
                                <Share2 size={16} />
                              </button>
                            </div>
                          );
                        })}

                        <button 
                          onClick={() => setView('creator')}
                          style={{
                            marginTop: '12px', padding: '16px', borderRadius: '16px', border: '1px dashed var(--glass-border)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                            color: 'var(--color-accent)', fontWeight: 800, fontSize: '13px'
                          }}
                        >
                          <Plus size={18} />
                          DESIGN CUSTOM TUNING
                        </button>
                     </div>
                  </div>
                </>
              ) : (
                /* CUSTOM CREATOR VIEW */
                <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                   <div>
                      <p className="label-text" style={{ marginBottom: '8px' }}>IDENTITY</p>
                      <input 
                        className="glass-pill"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        style={{ width: '100%', height: '54px', background: 'none', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', padding: '0 20px', outline: 'none', fontSize: '14px', borderRadius: '16px' }} 
                      />
                   </div>

                   <div>
                      <p className="label-text" style={{ marginBottom: '16px' }}>STRING CONFIGURATION</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                         {customNotes.map((note, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                               <div className="glass-pill" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>{i + 1}</div>
                               <div className="glass-premium" style={{ flex: 1, height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', borderRadius: '12px' }}>
                                   <button onClick={() => updateStringNote(i, -1)} style={{ padding: '8px' }}><p style={{ fontSize: '20px' }}>-</p></button>
                                   <span style={{ fontWeight: 800, fontSize: '18px', color: 'var(--color-accent)' }}>{note}</span>
                                   <button onClick={() => updateStringNote(i, 1)} style={{ padding: '8px' }}><p style={{ fontSize: '20px' }}>+</p></button>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>

                   <button 
                     onClick={onSaveCustom}
                     style={{ width: '100%', height: '60px', borderRadius: '20px', backgroundColor: 'var(--color-accent)', color: isOutdoorMode ? 'white' : 'black', fontWeight: 800, fontSize: '16px', marginTop: '10px' }}
                   >
                     SAVE & APPLY TUNING
                   </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const TUNINGS: Record<InstrumentType, TuningInfo[]> = {
  Guitar: [
    { name: 'Standard', notes: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'] },
    { name: 'Drop D', notes: ['D2', 'A2', 'D3', 'G3', 'B3', 'E4'] },
    { name: 'DADGAD', notes: ['D2', 'A2', 'D3', 'G3', 'A3', 'D4'] },
    { name: 'Open G', notes: ['D2', 'G2', 'D3', 'G3', 'B3', 'D4'] },
    { name: 'Half Step Down', notes: ['Eb2', 'Ab2', 'Db3', 'Gb3', 'Bb3', 'Eb4'] },
  ],
  Bass: [
    { name: 'Standard', notes: ['E1', 'A1', 'D2', 'G2'] },
    { name: 'Drop D', notes: ['D1', 'A1', 'D2', 'G2'] },
  ],
  Ukulele: [
    { name: 'Standard (gCEA)', notes: ['G4', 'C4', 'E4', 'A4'] },
    { name: 'Low G', notes: ['G3', 'C4', 'E4', 'A4'] },
  ],
  Violin: [
    { name: 'Standard', notes: ['G3', 'D4', 'A4', 'E5'] },
  ],
};
