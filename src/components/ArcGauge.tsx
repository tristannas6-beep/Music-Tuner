import React from 'react';
import { motion } from 'framer-motion';

/**
 * ArcGauge - V4.0.0 Elite Edition
 * Features: SVG Semi-Circular Gauge, Neon Indicator, Real-time Smoothing.
 */

interface ArcGaugeProps {
  cents: number;
  status: 'idle' | 'perfect' | 'detecting';
  note: string;
}

export const ArcGauge: React.FC<ArcGaugeProps> = ({ cents, status, note }) => {
  // Map cents (-50 to 50) to angle (-60 to 60)
  const angle = (cents / 50) * 60;
  
  // Dynamic colors based on status
  const accentColor = status === 'perfect' ? 'var(--color-success)' : 'var(--color-accent)';
  const glowShadow = status === 'perfect' ? 'var(--glow-success)' : 'var(--glow-accent)';

  return (
    <div style={{ position: 'relative', width: '300px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="300" height="200" viewBox="0 0 300 200">
        
        {/* 1. Background Arc Track */}
        <path 
          d="M 50 150 A 110 110 0 0 1 250 150" 
          fill="none" 
          stroke="rgba(255,255,255,0.05)" 
          strokeWidth="4" 
          strokeLinecap="round" 
        />

        {/* 2. Scale Ticks */}
        {[-50, -25, 0, 25, 50].map((tick) => {
          const rotation = (tick / 50) * 60;
          return (
            <line
              key={tick}
              x1="150" y1="30" x2="150" y2="40"
              stroke={tick === 0 ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'}
              strokeWidth="2"
              transform={`rotate(${rotation} 150 150)`}
            />
          );
        })}

        {/* 3. Main Indicator Needle (Glow Line) */}
        <motion.line
          initial={{ rotate: 0 }}
          animate={{ rotate: angle }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          x1="150" y1="40" x2="150" y2="150"
          stroke={accentColor}
          strokeWidth="3"
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 8px ${accentColor})` }}
          transform-origin="150px 150px"
        />

        {/* 4. Center Anchor Decoration */}
        <circle cx="150" cy="150" r="4" fill={accentColor} style={{ filter: `drop-shadow(0 0 5px ${accentColor})` }} />
      </svg>

      {/* 5. Central Info Display */}
      <div style={{ 
        position: 'absolute', 
        top: '100px', 
        textAlign: 'center',
        width: '100%'
      }}>
        <motion.div
           animate={{ scale: status === 'perfect' ? [1, 1.05, 1] : 1 }}
           transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <h1 className="huge-text" style={{ 
            fontSize: '84px', 
            margin: 0, 
            color: accentColor, 
            textShadow: glowShadow,
            letterSpacing: '-0.02em'
          }}>
            {note}
          </h1>
        </motion.div>
        
        <div style={{ marginTop: '-10px' }}>
          <p className="label-text" style={{ fontSize: '10px', color: status === 'perfect' ? 'var(--color-success)' : 'var(--text-secondary)' }}>
            {status === 'idle' ? 'STANDBY' : `${cents > 0 ? '+' : ''}${Math.round(cents)} Cents`}
          </p>
        </div>
      </div>

      {/* Footer Status Message */}
      <div style={{ position: 'absolute', bottom: 0, padding: '4px 12px', borderRadius: '12px', background: 'rgba(26, 232, 232, 0.05)', border: '1px solid rgba(26, 232, 232, 0.1)' }}>
         <p className="label-text" style={{ fontSize: '9px', letterSpacing: '0.2em' }}>
           {status === 'perfect' ? 'PERFECTLY TUNED' : (status === 'idle' ? 'AWAITING RESONANCE' : 'ENGINE ACTIVE')}
         </p>
      </div>
    </div>
  );
};
