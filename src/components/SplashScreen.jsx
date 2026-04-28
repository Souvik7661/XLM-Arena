import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState('in'); // 'in' → 'hold' → 'out'

  useEffect(() => {
    // Hold for 2.4s then fade out
    const holdTimer = setTimeout(() => setPhase('out'), 2400);
    // Tell parent it's done after fade-out completes (0.9s)
    const doneTimer = setTimeout(() => onDone(), 3300);
    return () => {
      clearTimeout(holdTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === 'out' ? 0 : 1 }}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: '#0b1120',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.75rem',
          }}
        >
          {/* Radial glow behind logo */}
          <div style={{
            position: 'absolute',
            width: '420px',
            height: '420px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            style={{ position: 'relative' }}
          >
            <img
              src="/favicon.svg"
              alt="XLM Arena Logo"
              style={{ width: '88px', height: '88px', display: 'block' }}
            />
          </motion.div>

          {/* Welcome text */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: '#10b981',
              marginBottom: '0.65rem',
              fontFamily: "'Space Mono', monospace",
            }}>
              Welcome to
            </div>
            <div style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(2.2rem, 6vw, 3.5rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: '#f8fafc',
            }}>
              XLM<span style={{
                background: 'linear-gradient(135deg, #10b981, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>Arena</span>
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.75 }}
            style={{
              color: '#64748b',
              fontSize: '0.95rem',
              fontFamily: "'Inter', sans-serif",
              letterSpacing: '0.01em',
              margin: 0,
            }}
          >
            The decentralized esports prediction market on Stellar
          </motion.p>

          {/* Loading bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            style={{ marginTop: '0.5rem', width: '180px', height: '2px', background: '#1e293b', borderRadius: '2px', overflow: 'hidden' }}
          >
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1], delay: 0.95 }}
              style={{ height: '100%', background: 'linear-gradient(90deg, #10b981, #3b82f6)', borderRadius: '2px' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
