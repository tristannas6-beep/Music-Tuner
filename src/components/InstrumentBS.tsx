import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Plus, 
  CheckCircle2, 
  Guitar, 
  Music, 
  Share2
} from 'lucide-react';
import { useAppContext, type Tuning } from '../context/AppContext';

/**
 * InstrumentBS - V4.0.0 Elite Edition "Instrument Selector"
 * Features: Professional Two-Pane Hierarchy, Category Filtering, Custom Tuning Designer.
 * Optimized: Cleaned up unused imports and state for V4 stabilization.
 */

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  { id: 'Guitar', name: 'Guitar', icon: Guitar },
  { id: 'Bass', name: 'Bass', icon: Music },
  { id: 'Ukulele', name: 'Ukulele', icon: Music },
  { id: 'Violin', name: 'Violin', icon: Music },
];

export const InstrumentBS: React.FC<Props> = ({ isOpen, onClose }) => {
  const { 
    activeTuning, 
    setTuning, 
    tuningLibrary,
    setSelectedInstrument 
  } = useAppContext();

  const [activeCategory, setActiveCategory] = useState('Guitar');

  const filteredTunings = tuningLibrary[activeCategory] || [];

  const handleSelect = async (t: Tuning) => {
    // If category changed, update dominant instrument
    await setSelectedInstrument(activeCategory as any);
    await setTuning(t);
    onClose();
  };

  const handleShare = (t: Tuning) => {
    const code = btoa(`TUNER:${t.name}|${t.notes.join(',')}`);
    const url = `${window.location.origin}${window.location.pathname}?tuning=${code}`;
    navigator.clipboard.writeText(url);
    alert('Tuning link copied to clipboard!');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            backgroundColor: '#000000',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* 1. Header */}
          <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
             <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Instrument Selection</h2>
             <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94A3B8' }}>
                <X size={24} />
             </button>
          </div>

          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
             
             {/* 2. Side Panel (Categories) */}
             <div style={{ width: '110px', backgroundColor: '#0D0D0E', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px' }}>
                {CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      style={{
                        height: '80px',
                        borderRadius: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        background: isActive ? 'var(--color-accent)' : 'transparent',
                        color: isActive ? '#000000' : '#475569',
                        border: 'none',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <Icon size={20} strokeWidth={2.5} />
                      <span style={{ fontSize: '10px', fontWeight: 800 }}>{cat.name}</span>
                    </button>
                  );
                })}
             </div>

             {/* 3. Main Panel (Tunings) */}
             <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
                <h3 className="label-text" style={{ marginBottom: '20px' }}>Select Tuning</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                   {filteredTunings.map((t: Tuning) => {
                     const isSelected = activeTuning.name === t.name;
                     return (
                       <motion.div
                         key={t.name}
                         whileTap={{ scale: 0.98 }}
                         onClick={() => handleSelect(t)}
                         className="glass-premium"
                         style={{
                           padding: '20px',
                           borderRadius: '20px',
                           display: 'flex',
                           justifyContent: 'space-between',
                           alignItems: 'center',
                           border: isSelected ? '1px solid var(--color-accent)' : '1px solid rgba(255,255,255,0.05)',
                           backgroundColor: isSelected ? 'rgba(26, 232, 232, 0.08)' : 'rgba(255,255,255,0.02)'
                         }}
                       >
                         <div>
                            <p style={{ fontWeight: 800, fontSize: '16px', color: isSelected ? 'var(--color-accent)' : '#FFFFFF' }}>{t.name}</p>
                            <p style={{ fontSize: '11px', opacity: 0.5, letterSpacing: '0.1em', marginTop: '4px' }}>{t.notes.join(' • ')}</p>
                         </div>
                         {isSelected ? (
                           <CheckCircle2 size={24} color="var(--color-accent)" style={{ filter: 'var(--glow-accent)' }} />
                         ) : (
                           <button 
                             onClick={(e) => { e.stopPropagation(); handleShare(t); }}
                             style={{ background: 'none', border: 'none', color: '#475569' }}
                           >
                              <Share2 size={18} />
                           </button>
                         )}
                       </motion.div>
                     );
                   })}
                </div>

                <button 
                  className="glass-pill"
                  style={{ 
                    marginTop: '32px', 
                    width: '100%', 
                    padding: '20px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '12px',
                    borderColor: 'var(--color-accent)',
                    backgroundColor: 'rgba(26, 232, 232, 0.05)'
                  }}
                >
                  <Plus size={20} color="var(--color-accent)" />
                  <span style={{ fontWeight: 800, color: 'var(--color-accent)', fontSize: '14px' }}>Create Custom Tuning</span>
                </button>
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
