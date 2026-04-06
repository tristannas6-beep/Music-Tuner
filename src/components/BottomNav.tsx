import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic2, Timer, Music, Settings } from 'lucide-react';

/**
 * BottomNav - Floating Elite Dock v2.0
 * Features: Floating blurred pod, Sliding spring active state, Massive Glassmorphism.
 */

export type TabType = 'tuner' | 'metronome' | 'pitch' | 'settings';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const tabs = [
  { id: 'tuner' as TabType, icon: Mic2, label: 'TUNER' },
  { id: 'metronome' as TabType, icon: Timer, label: 'DRUM' },
  { id: 'pitch' as TabType, icon: Music, label: 'PIPE' },
  { id: 'settings' as TabType, icon: Settings, label: 'CONFIG' },
];

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div style={{
      position: 'fixed',
      bottom: 'calc(20px + var(--safe-area-bottom))',
      left: '20px',
      right: '20px',
      display: 'flex',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <nav 
        className="glass-premium"
        style={{
          width: '100%',
          maxWidth: '360px',
          height: '76px',
          borderRadius: '38px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '0 12px',
          background: 'rgba(15, 15, 18, 0.85)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
        }}>
        
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '64px',
                height: '64px',
                color: isActive ? 'var(--color-accent)' : 'var(--text-secondary)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
            >
              {/* Sliding Active Indicator */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="elite-dock-active"
                    style={{
                      position: 'absolute',
                      inset: '4px',
                      backgroundColor: 'rgba(34, 211, 238, 0.1)',
                      borderRadius: '50%',
                      zIndex: -1,
                      border: '1px solid rgba(34, 211, 238, 0.2)'
                    }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </AnimatePresence>

              <Icon size={22} className={isActive ? 'neon-glow-cyan' : ''} />
              
              <motion.span 
                animate={{ 
                  opacity: isActive ? 1 : 0.4,
                  scale: isActive ? 1 : 0.8,
                  y: isActive ? 4 : 0
                }}
                className="label-text" 
                style={{ 
                  fontSize: '8px', 
                  marginTop: '2px', 
                  fontWeight: 800,
                  color: isActive ? 'var(--color-accent)' : 'var(--text-secondary)'
                }}>
                {tab.label}
              </motion.span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
