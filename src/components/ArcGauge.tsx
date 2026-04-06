import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ArcGauge - A futuristic, high-fidelity tuning visualization.
 * Replaces the traditional needle with a glowing SVG arc and center halo.
 */

interface Props {
  cents: number; // -50 to 50
  status: 'idle' | 'detecting' | 'perfect';
  note: string;
}

export const ArcGauge: React.FC<Props> = ({ cents, status, note }) => {
  const isPerfect = Math.abs(cents) < 3;
  const isActive = status !== 'idle';
  
  // Dynamic Colors based on elite design system
  const accentColor = isPerfect ? 'var(--color-success)' : 'var(--color-accent)';
  const glowClass = isPerfect ? 'neon-glow-emerald' : 'neon-glow-cyan';

  // SVG Math for Arc
  const size = 300;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2 - 20;
  const center = size / 2;
  
  // Conversion: cents (-50 to 50) -> angle in degrees
  // We want the arc to go from -90deg to +90deg (180deg total)
  const angle = (cents / 50) * 80; // Scaled for aesthetic range

  return (
    <div style={{
      position: 'relative',
      width: `${size}px`,
      height: `${size}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* 1. CENTRAL GLOWING HALO */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              backgroundColor: isPerfect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(34, 211, 238, 0.05)'
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            style={{
              position: 'absolute',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              filter: 'blur(40px)',
              zIndex: 0
            }}
          />
        )}
      </AnimatePresence>

      <motion.div
        animate={{ 
          borderColor: isActive ? accentColor : 'var(--glass-border)',
          boxShadow: isPerfect ? '0 0 40px rgba(16, 185, 129, 0.2)' : 'none'
        }}
        className="glass-premium"
        style={{
          width: '140px',
          height: '140px',
          borderRadius: '50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
          borderWidth: '2px'
        }}
      >
        <motion.span 
          className="huge-text"
          animate={{ 
            color: isActive ? 'white' : 'var(--text-secondary)',
            scale: isPerfect ? [1, 1.05, 1] : 1
          }}
          transition={{ repeat: isPerfect ? Infinity : 0, duration: 1.5 }}
          style={{ fontSize: '72px' }}
        >
          {note || '--'}
        </motion.span>
        
        {isActive && (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="label-text"
            style={{ color: accentColor, marginTop: '-5px', fontSize: '10px' }}
          >
            {isPerfect ? 'PERFECT' : `${cents > 0 ? '+' : ''}${cents.toFixed(1)}`}
          </motion.span>
        )}
      </motion.div>

      {/* 2. SVG ARC GAUGE */}
      <svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`}
        style={{ position: 'absolute', transform: 'rotate(-90deg)', zIndex: 1 }}
      >
        {/* Background Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--glass-border)"
          strokeWidth="2"
          strokeDasharray="4, 6"
        />

        {/* Active Needle / Indicator */}
        <AnimatePresence>
          {isActive && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.line
                animate={{
                  x1: center + radius * Math.cos((angle * Math.PI) / 180),
                  y1: center + radius * Math.sin((angle * Math.PI) / 180),
                  x2: center + (radius - 25) * Math.cos((angle * Math.PI) / 180),
                  y2: center + (radius - 25) * Math.sin((angle * Math.PI) / 180),
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                stroke={accentColor}
                strokeWidth="4"
                strokeLinecap="round"
                className={glowClass}
              />
              
              {/* Target Dot */}
              <circle
                cx={center + radius}
                cy={center}
                r="4"
                fill="var(--text-secondary)"
                opacity="0.3"
              />
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      {/* 3. PRECISION TICKS (Bottom) */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        display: 'flex',
        gap: '4px'
      }}>
        {[-20, -10, 0, 10, 20].map((t) => (
          <div 
            key={t}
            style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              backgroundColor: t === 0 ? accentColor : 'var(--glass-border)',
              opacity: isActive ? (Math.abs(cents - t) < 5 ? 1 : 0.3) : 0.1,
              transition: 'all 0.3s'
            }}
          />
        ))}
      </div>
    </div>
  );
};
