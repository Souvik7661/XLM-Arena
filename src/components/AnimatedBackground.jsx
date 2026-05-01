import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -1, overflow: 'hidden', pointerEvents: 'none', background: '#050b14' }}>

      {/* Deep space base gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 15% 85%, rgba(6,182,212,0.08) 0%, transparent 50%), radial-gradient(ellipse at 85% 15%, rgba(239,68,68,0.08) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(244,63,94,0.04) 0%, transparent 70%)',
      }} />

      {/* Subtle dot grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
      }} />

      {/* Large aurora orb — top right */}
      <motion.div
        style={{
          position: 'absolute', top: '-20%', right: '-10%',
          width: '60vw', height: '60vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(239,68,68,0.12) 0%, rgba(244,63,94,0.06) 50%, transparent 70%)',
          willChange: 'transform',
        }}
        animate={{ scale: [1, 1.15, 0.95, 1.1, 1], x: [0, 30, -15, 20, 0], y: [0, -20, 10, -15, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Large aurora orb — bottom left */}
      <motion.div
        style={{
          position: 'absolute', bottom: '-20%', left: '-10%',
          width: '55vw', height: '55vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, rgba(45,212,191,0.05) 50%, transparent 70%)',
          willChange: 'transform',
        }}
        animate={{ scale: [1, 1.1, 0.9, 1.05, 1], x: [0, -20, 15, -10, 0], y: [0, 20, -10, 15, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />

      {/* Center red glow */}
      <motion.div
        style={{
          position: 'absolute', top: '30%', left: '35%',
          width: '35vw', height: '35vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(239,68,68,0.05) 0%, transparent 70%)',
          willChange: 'transform, opacity',
        }}
        animate={{ scale: [1, 1.2, 0.85, 1], opacity: [0.5, 1, 0.4, 0.5] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
      />

      {/* Animated top border beam */}
      <motion.div
        style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(6,182,212,0) 20%, rgba(6,182,212,0.5) 50%, rgba(239,68,68,0.5) 70%, transparent 100%)',
        }}
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* HUD Data Grid Elements */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: i % 4 === 0 ? '12px' : '2px',
            height: i % 4 === 0 ? '2px' : '12px',
            background: i % 3 === 0 ? 'rgba(239,68,68,0.7)' : 'rgba(6,182,212,0.6)',
            top: `${(i * 13) % 100}%`,
            left: `${(i * 17) % 100}%`,
            willChange: 'transform, opacity',
          }}
          animate={{
            x: i % 2 === 0 ? [0, 40, 40, 0] : 0,
            y: i % 2 !== 0 ? [0, 40, 40, 0] : 0,
            opacity: [0, 0.8, 0, 0],
          }}
          transition={{ duration: 1.5 + (i % 3) * 0.5, repeat: Infinity, ease: "steps(4, end)", delay: i * 0.1 }}
        />
      ))}

      {/* Orbiting ring */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '900px', height: '900px', opacity: 0.1 }}>
        <motion.div
          style={{ position: 'absolute', inset: 0, border: '1px dashed rgba(6,182,212,0.6)', borderRadius: '50%', willChange: 'transform' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          style={{ position: 'absolute', inset: '80px', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '50%', willChange: 'transform' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          style={{ position: 'absolute', inset: '160px', border: '2px dashed rgba(6,182,212,0.2)', borderRadius: '50%', willChange: 'transform' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
      </div>

    </div>
  );
}
