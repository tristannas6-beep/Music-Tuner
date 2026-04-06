import React from 'react';
import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

/**
 * PermissionScreen - V4.0.0 Elite Edition
 * Features: Glossy Dialog, Glowing Mic Icon, Professional UX.
 */

export const PermissionScreen: React.FC = () => {
  const { setIsPermissionGranted } = useAppContext();

  const handleRequest = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setIsPermissionGranted(true);
    } catch (e) {
      console.error('Permission: Access denied', e);
      setIsPermissionGranted(false);
    }
  };

  const handleSkip = () => {
    setIsPermissionGranted(false);
  };

  return (
    <div 
      style={{ 
        height: '100vh', 
        width: '100vw', 
        backgroundColor: '#000000', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        position: 'fixed'
      }}
    >
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        style={{ 
          width: '90%', 
          maxWidth: '400px', 
          backgroundColor: '#0D0D0E', 
          borderRadius: '32px',
          padding: '40px 24px',
          textAlign: 'center',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.05)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Glow Accent at bottom of card */}
        <div style={{ 
          position: 'absolute', 
          bottom: '-50px', 
          left: '20%', 
          right: '20%', 
          height: '100px', 
          background: 'radial-gradient(circle, rgba(26, 232, 232, 0.15) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />

        {/* 1. Icon Section */}
        <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 32px' }}>
           <div className="glass-premium" style={{ 
             inset: 0, 
             position: 'absolute', 
             borderRadius: '24px', 
             display: 'flex', 
             alignItems: 'center', 
             justifyContent: 'center',
             border: '1px solid rgba(26, 232, 232, 0.2)'
           }}>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <Mic size={48} color="#1AE8E8" strokeWidth={1.5} />
              </motion.div>
           </div>
           {/* Outer halo */}
           <div style={{ 
             position: 'absolute', 
             inset: '-10px', 
             border: '1px dashed rgba(26, 232, 232, 0.3)',
             borderRadius: '28px',
             opacity: 0.5
           }} />
        </div>

        {/* 2. Text Section */}
        <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '16px', color: '#FFFFFF' }}>
          Capture the<br />Performance
        </h2>
        <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6, marginBottom: '40px', padding: '0 10px' }}>
          Allow access to your microphone so we can hear your musical instrument and provide real-time architectural feedback.
        </p>

        {/* 3. Action Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
           <motion.button
             whileTap={{ scale: 0.96 }}
             onClick={handleRequest}
             style={{
               width: '100%',
               height: '60px',
               borderRadius: '16px',
               backgroundColor: '#1AE8E8',
               color: '#000000',
               fontSize: '16px',
               fontWeight: 800,
               border: 'none',
               cursor: 'pointer',
               boxShadow: '0 8px 24px rgba(26, 232, 232, 0.3)'
             }}
           >
             Allow
           </motion.button>
           
           <button
             onClick={handleSkip}
             style={{
               background: 'none',
               border: 'none',
               color: '#94A3B8',
               fontSize: '14px',
               fontWeight: 600,
               cursor: 'pointer',
               padding: '10px'
             }}
           >
             Maybe Later
           </button>
        </div>

        <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.15)', marginTop: '32px', letterSpacing: '0.1em' }}>
          V.1.0.0 ELITE MODULE
        </p>
      </motion.div>
    </div>
  );
};
