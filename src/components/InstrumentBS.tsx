import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Check } from 'lucide-react';
import { useAppContext, type InstrumentType, type TuningInfo } from '../context/AppContext';

interface InstrumentBSProps {
  isOpen: boolean;
  onClose: () => void;
}

const TUNINGS: Record<InstrumentType, TuningInfo[]> = {
  Guitar: [
    { name: 'Standard', notes: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'] },
    { name: 'Drop D', notes: ['D2', 'A2', 'D3', 'G3', 'B3', 'E4'] },
    { name: 'Half Step Down', notes: ['Eb2', 'Ab2', 'Db3', 'Gb3', 'Bb3', 'Eb4'] },
  ],
  Bass: [
    { name: 'Standard', notes: ['E1', 'A1', 'D2', 'G2'] },
    { name: 'Drop D', notes: ['D1', 'A1', 'D2', 'G2'] },
  ],
  Ukulele: [
    { name: 'Standard (gCEA)', notes: ['G4', 'C4', 'E4', 'A4'] },
  ],
  Violin: [
    { name: 'Standard', notes: ['G3', 'D4', 'A4', 'E5'] },
  ],
};

export const InstrumentBS: React.FC<InstrumentBSProps> = ({ isOpen, onClose }) => {
  const { selectedInstrument, activeTuning, setInstrument, setTuning } = useAppContext();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              zIndex: 1000,
              backdropFilter: 'blur(4px)'
            }}
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: '#1a1a1a',
              borderTopLeftRadius: '32px',
              borderTopRightRadius: '32px',
              zIndex: 1001,
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              paddingBottom: 'var(--safe-area-bottom)'
            }}
          >
            <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Choose Instrument</h2>
              <button onClick={onClose} className="glass" style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              {/* Sidebar */}
              <div style={{ width: '100px', backgroundColor: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px 8px' }}>
                {(Object.keys(TUNINGS) as InstrumentType[]).map((inst) => (
                  <button
                    key={inst}
                    onClick={() => setInstrument(inst)}
                    style={{
                      padding: '12px 4px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 600,
                      backgroundColor: selectedInstrument === inst ? 'var(--color-accent)' : 'transparent',
                      color: selectedInstrument === inst ? 'white' : 'var(--text-secondary)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {inst}
                  </button>
                ))}
              </div>

              {/* List */}
              <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p className="label-text" style={{ marginBottom: '8px' }}>Tuning Variations</p>
                {TUNINGS[selectedInstrument].map((t) => {
                  const isSelected = activeTuning.name === t.name;
                  return (
                    <button
                      key={t.name}
                      onClick={() => {
                        setTuning(t);
                        onClose();
                      }}
                      className="glass"
                      style={{
                        padding: '16px 20px',
                        borderRadius: '16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        textAlign: 'left',
                        border: isSelected ? '1px solid var(--color-accent)' : '1px solid rgba(255,255,255,0.05)'
                      }}
                    >
                      <div>
                        <p style={{ fontWeight: 600, marginBottom: '4px' }}>{t.name}</p>
                        <p className="label-text" style={{ fontSize: '10px', textTransform: 'none' }}>{t.notes.join(' • ')}</p>
                      </div>
                      {isSelected && <Check size={18} color="var(--color-accent)" />}
                    </button>
                  );
                })}

                <button style={{
                  marginTop: '12px',
                  padding: '16px',
                  borderRadius: '16px',
                  border: '1px dashed rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  color: 'var(--text-secondary)',
                  fontSize: '14px',
                  fontWeight: 600
                }}>
                  <Plus size={16} />
                  Create Custom Tuning
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
