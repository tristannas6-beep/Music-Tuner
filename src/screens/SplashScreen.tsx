import React from 'react';
import { motion } from 'framer-motion';

/**
 * SplashScreen - V4.0.0 Elite Elite Edition
 * Features: Minimalist design, Glowing Cyan Glow, Professional Branding.
 */

export const SplashScreen: React.FC = () => {
  return (
    <div 
      style={{ 
        height: '100vh', 
        width: '100vw', 
        backgroundColor: '#000000', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '32px' }}
      >
        {/* Glowing Background Halo */}
        <div style={{ 
          position: 'absolute', 
          inset: '-20px', 
          background: 'radial-gradient(circle, rgba(26, 232, 232, 0.25) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
        
        {/* Central Logo Symbol (Abstract Tuning Fork / Instrument shape) */}
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
           <motion.path 
             initial={{ pathLength: 0 }}
             animate={{ pathLength: 1 }}
             transition={{ duration: 1.5, delay: 0.5 }}
             d="M30 20V60C30 71.0457 38.9543 80 50 80C61.0457 80 70 71.0457 70 60V20M50 80V95" 
             stroke="#1AE8E8" 
             strokeWidth="8" 
             strokeLinecap="round" 
           />
           <motion.circle 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 1.2 }}
             cx="30" cy="20" r="6" fill="#1AE8E8" 
           />
           <motion.circle 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 1.2 }}
             cx="70" cy="20" r="6" fill="#1AE8E8" 
           />
        </svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        style={{ textAlign: 'center' }}
      >
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 800, 
          letterSpacing: '0.1em', 
          color: '#FFFFFF',
          margin: 0,
          textShadow: '0 0 20px rgba(26, 232, 232, 0.4)'
        }}>
          TUNER <span style={{ color: '#1AE8E8' }}>PRO</span>
        </h1>
        <p className="label-text" style={{ fontSize: '10px', marginTop: '8px', opacity: 0.5 }}>
          V4.0.0 ELITE MODULE
        </p>
      </motion.div>

      {/* Version Status Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1.5 }}
        style={{ position: 'absolute', bottom: '40px' }}
      >
        <p style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.2em' }}>SYNCHRONIZING ENGINE</p>
      </motion.div>
    </div>
  );
};
