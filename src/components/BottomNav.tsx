import React from 'react';
import { motion } from 'framer-motion';
import { Mic2, Timer, Music, Settings } from 'lucide-react';

export type TabType = 'tuner' | 'metronome' | 'pitch' | 'settings';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const tabs = [
  { id: 'tuner' as TabType, icon: Mic2, label: 'Tuner' },
  { id: 'metronome' as TabType, icon: Timer, label: 'Metronome' },
  { id: 'pitch' as TabType, icon: Music, label: 'Pitch Pipe' },
  { id: 'settings' as TabType, icon: Settings, label: 'Settings' },
];

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="glass" style={{
      position: 'fixed',
      bottom: 'var(--safe-area-bottom)',
      left: '20px',
      right: '20px',
      height: '64px',
      borderRadius: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '0 8px',
      zIndex: 100,
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
              width: '48px',
              height: '48px',
              transition: 'color 0.3s ease',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
            }}
          >
            {isActive && (
              <motion.div
                layoutId="active-tab"
                className="active-bg"
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '14px',
                  zIndex: -1,
                }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
              />
            )}
            <Icon size={24} />
            <span style={{ fontSize: '10px', marginTop: '4px', fontWeight: isActive ? 600 : 400 }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
