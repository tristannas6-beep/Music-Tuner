import React from 'react';
import { motion } from 'framer-motion';

interface TunerGaugeProps {
  cents: number; // -50 to 50
  status: 'idle' | 'detecting' | 'perfect';
  note: string;
}

export const TunerGauge: React.FC<TunerGaugeProps> = ({ cents, status, note }) => {
  const isPerfect = Math.abs(cents) < 5;
  const color = status === 'idle' ? 'var(--text-secondary)' : (isPerfect ? 'var(--color-success)' : 'var(--color-danger)');

  return (
    <div style={{
      position: 'relative',
      width: '300px',
      height: '300px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '40px',
    }}>
      {/* Background Glow */}
      <motion.div
        animate={{
          scale: isPerfect ? [1, 1.1, 1] : 1,
          opacity: isPerfect ? 0.3 : 0,
        }}
        transition={{ repeat: Infinity, duration: 2 }}
        style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-success)',
          filter: 'blur(60px)',
          zIndex: -1,
        }}
      />

      {/* Note Text */}
      <motion.h1
        className="huge-text"
        animate={{ color: color }}
        style={{ margin: 0, fontSize: '120px' }}
      >
        {note || '--'}
      </motion.h1>
      
      <p className="label-text" style={{ color: color, marginTop: '-10px' }}>
        {status === 'idle' ? 'Play a string' : `${cents > 0 ? '+' : ''}${cents} cents`}
      </p>

      {/* SVG Gauge */}
      <svg width="300" height="150" viewBox="0 0 300 150" style={{ position: 'absolute', bottom: '-40px' }}>
        <path
          d="M 20 130 A 130 130 0 0 1 280 130"
          fill="none"
          stroke="var(--text-secondary)"
          strokeWidth="2"
          strokeOpacity="0.2"
        />
        
        {/* Ticks */}
        {[...Array(11)].map((_, i) => {
          const angle = (i * 18 - 90);
          const rad = (angle * Math.PI) / 180;
          const x1 = 150 + Math.cos(rad) * 125;
          const y1 = 140 + Math.sin(rad) * 125;
          const x2 = 150 + Math.cos(rad) * 115;
          const y2 = 140 + Math.sin(rad) * 115;
          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={i === 5 ? 'var(--text-primary)' : 'var(--text-secondary)'}
              strokeWidth={i === 5 ? 2 : 1}
              strokeOpacity={i === 5 ? 0.8 : 0.4}
            />
          );
        })}

        {/* Needle */}
        <motion.line
          animate={{
            x1: 150,
            y1: 140,
            x2: 150 + Math.cos(((cents * 1.8 - 90) * Math.PI) / 180) * 110,
            y2: 140 + Math.sin(((cents * 1.8 - 90) * Math.PI) / 180) * 110,
          }}
          transition={{ type: 'spring', stiffness: 50, damping: 10 }}
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
        />
        
        {/* Center Pivot */}
        <circle cx="150" cy="140" r="4" fill="var(--text-primary)" />
      </svg>
    </div>
  );
};
