import React from 'react';
import { motion } from 'framer-motion';
import { Music2, Compass, Settings, Zap } from 'lucide-react';

/**
 * BottomNav - V4.0.0 Elite Edition
 * Features: Glowing Active State, Minimalist Icons, Ultra-Dark Glass.
 */

export type TabType = 'tuner' | 'metronome' | 'pitch' | 'settings';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'tuner', label: 'TUNER', icon: Music2 },
    { id: 'metronome', label: 'METRO', icon: Zap },
    { id: 'pitch', label: 'PITCH', icon: Compass },
    { id: 'settings', label: 'SETTINGS', icon: Settings },
  ];

  return (
    <nav 
      className="glass-premium"
      style={{
        position: 'fixed',
        bottom: '30px',
        left: '20px',
        right: '20px',
        height: '76px',
        borderRadius: '38px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 10px',
        zIndex: 1000,
        backgroundColor: 'rgba(0,0,0,0.85)',
        border: '1px solid rgba(26, 232, 232, 0.12)'
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              position: 'relative',
              background: 'none',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              width: '60px',
              cursor: 'pointer'
            }}
          >
            {/* Active Highlight Circle */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  layoutId="activeTabBg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(26, 232, 232, 0.1)',
                    filter: 'blur(8px)',
                    zIndex: -1
                  }}
                />
              )}
            </AnimatePresence>

            <motion.div
              animate={{ 
                color: isActive ? 'var(--color-accent)' : '#475569',
                scale: isActive ? 1.15 : 1
              }}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                filter: isActive ? 'drop-shadow(0 0 10px rgba(26, 232, 232, 0.5))' : 'none'
              }}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            </motion.div>

            <span style={{ 
              fontSize: '8px', 
              fontWeight: 800, 
              color: isActive ? 'var(--color-accent)' : '#475569',
              letterSpacing: '0.1em',
              opacity: isActive ? 1 : 0.5
            }}>
              {tab.label}
            </span>

            {/* Micro Indicator Dot */}
            {isActive && (
              <motion.div 
                layoutId="activeDot"
                style={{ 
                  width: '4px', 
                  height: '4px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--color-accent)',
                  marginTop: '2px',
                  boxShadow: 'var(--glow-accent)'
                }} 
              />
            )}
          </button>
        );
      })}
    </nav>
  );
};

import { AnimatePresence } from 'framer-motion';
