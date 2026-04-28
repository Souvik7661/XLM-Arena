import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen({ onDone }) {
  const [exiting, setExiting] = useState(false);

  const handleEnter = () => {
    setExiting(true);
    setTimeout(onDone, 1200); // wait for exit animation
  };

  return (
    <AnimatePresence>
      {!exiting ? (
        <motion.div
          key="splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'radial-gradient(ellipse at 50% 60%, #0d1f2d 0%, #060d18 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0',
            overflow: 'hidden',
          }}
        >
          {/* Ambient glow rings */}
          <div style={{
            position: 'absolute',
            width: '600px', height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 65%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute',
            width: '900px', height: '900px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 65%)',
            pointerEvents: 'none',
          }} />

          {/* Subtle grid lines */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            pointerEvents: 'none',
          }} />

          {/* Logo */}
          <motion.img
            src="/favicon.svg"
            alt="XLM Arena"
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            style={{ width: '96px', height: '96px', marginBottom: '2rem' }}
          />

          {/* Welcome label */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '4px',
              textTransform: 'uppercase',
              color: '#10b981',
              marginBottom: '1rem',
            }}
          >
            Welcome to
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(3rem, 9vw, 5.5rem)',
              lineHeight: 1,
              letterSpacing: '-0.03em',
              marginBottom: '1.25rem',
            }}
          >
            <span style={{ color: '#f8fafc' }}>XLM</span>
            <span style={{
              background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Arena</span>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 1.05 }}
            style={{
              color: '#475569',
              fontSize: '1rem',
              fontFamily: "'Inter', sans-serif",
              marginBottom: '3rem',
              letterSpacing: '0.01em',
              textAlign: 'center',
              maxWidth: '380px',
              lineHeight: 1.6,
            }}
          >
            The decentralized esports prediction market built on Stellar
          </motion.p>

          {/* Enter button */}
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 1.3 }}
            onClick={handleEnter}
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(16,185,129,0.35)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: 'linear-gradient(135deg, #10b981, #3b82f6)',
              border: 'none',
              borderRadius: '14px',
              padding: '0.9rem 2.75rem',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: 700,
              fontFamily: "'Inter', sans-serif",
              cursor: 'pointer',
              letterSpacing: '0.02em',
              transition: 'box-shadow 0.3s ease',
            }}
          >
            Enter Arena →
          </motion.button>

          {/* Divider line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1], delay: 1.5 }}
            style={{
              position: 'absolute',
              bottom: '2.5rem',
              width: '120px', height: '1px',
              background: 'linear-gradient(90deg, transparent, #334155, transparent)',
            }}
          />

          {/* Bottom tag */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.0, delay: 1.7 }}
            style={{
              position: 'absolute',
              bottom: '1.25rem',
              fontSize: '0.7rem',
              color: '#1e293b',
              fontFamily: "'Space Mono', monospace",
              letterSpacing: '2px',
            }}
          >
            POWERED BY STELLAR
          </motion.div>
        </motion.div>
      ) : (
        /* Exit overlay sweep */
        <motion.div
          key="exit"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: '#060d18',
          }}
        />
      )}
    </AnimatePresence>
  );
}
