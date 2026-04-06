import React from 'react';
import { motion } from 'framer-motion';

/**
 * HexagonalIndicator - V4.0.0 Elite Edition
 * Features: SVG Hex Shape, Neon Active State, Subtle String Weight.
 */

interface HexProps {
  note: string;
  isActive: boolean;
  onClick: () => void;
  index: number;
}

export const HexagonalIndicator: React.FC<HexProps> = ({ note, isActive, onClick, index }) => {
  return (
    <motion.div
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      style={{ 
        cursor: 'pointer', 
        position: 'relative', 
        width: '54px', 
        height: '62px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <svg width="54" height="62" viewBox="0 0 54 62">
        {/* Hex Path */}
        <motion.path
          animate={{ 
            stroke: isActive ? 'var(--color-accent)' : 'rgba(255,255,255,0.08)',
            fill: isActive ? 'rgba(26, 232, 232, 0.12)' : 'rgba(255,255,255,0.02)',
            filter: isActive ? 'drop-shadow(0 0 10px rgba(26, 232, 232, 0.5))' : 'none'
          }}
          transition={{ duration: 0.3 }}
          d="M27 0 L54 15.5 V46.5 L27 62 L0 46.5 V15.5 Z"
          strokeWidth="2"
        />
      </svg>

      <span style={{ 
        position: 'absolute', 
        fontSize: '15px', 
        fontWeight: 800, 
        color: isActive ? '#FFFFFF' : '#475569',
        letterSpacing: '-0.02em'
      }}>
        {note.replace(/\d+/, '')}
      </span>

      {/* String Gauge Detail below hex */}
      <div style={{ 
        position: 'absolute', 
        bottom: '-12px', 
        width: `${1 + (5 - index) * 0.5}px`, 
        height: '8px', 
        borderRadius: '2px',
        backgroundColor: isActive ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)',
        boxShadow: isActive ? 'var(--glow-accent)' : 'none'
      }} />
    </motion.div>
  );
};
