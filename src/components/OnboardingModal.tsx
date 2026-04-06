import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Music } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const [step, setStep] = useState<'splash' | 'permission'>('splash');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStep('permission');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'var(--bg-color)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <AnimatePresence mode="wait">
        {step === 'splash' ? (
          <motion.div
            key="splash"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}
          >
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '30px',
              backgroundColor: 'var(--color-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 40px rgba(0, 116, 217, 0.3)'
            }}>
              <Music color="white" size={48} strokeWidth={2.5} />
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em' }}>MODERN TUNER</h1>
          </motion.div>
        ) : (
          <motion.div
            key="permission"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass"
            style={{
              padding: '40px 32px',
              borderRadius: '32px',
              maxWidth: '340px',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 116, 217, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              color: 'var(--color-accent)'
            }}>
              <Mic size={32} />
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px' }}>Microphone Access</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6, marginBottom: '32px' }}>
              Microphone access is required to hear your instrument and display tuning feedback in real-time.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setIsVisible(false)}
                style={{
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: 'var(--color-accent)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '16px'
                }}
              >
                Allow Access
              </motion.button>
              <button 
                onClick={() => setIsVisible(false)}
                style={{
                  height: '56px',
                  color: 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '15px'
                }}
              >
                Not Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
