import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -1, overflow: 'hidden', pointerEvents: 'none', background: 'var(--bg)' }}>
      {/* Dynamic Cybersecurity/Esports Grid */}
      <motion.div 
        style={{
          position: 'absolute',
          top: '-50%', left: '-50%', width: '200%', height: '200%',
          backgroundImage: `
            linear-gradient(rgba(0,245,160,0.08) 1px, transparent 1px), 
            linear-gradient(90deg, rgba(0,245,160,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
          transformOrigin: 'center'
        }}
        animate={{
          y: [0, 100],
          rotate: [0, 0.5, -0.5, 0]
        }}
        transition={{
          y: { repeat: Infinity, duration: 4, ease: "linear" },
          rotate: { repeat: Infinity, duration: 8, ease: "easeInOut" }
        }}
      />

      {/* Cyber/Neon pulse rings */}
      <motion.div
        style={{
          position: 'absolute',
          top: '20%', left: '10%',
          width: '30vw', height: '30vw',
          border: '2px solid rgba(0,217,245,0.1)',
          borderRadius: '50%',
          boxShadow: '0 0 40px rgba(0,217,245,0.05)'
        }}
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }}
      />
      
      <motion.div
        style={{
          position: 'absolute',
          bottom: '10%', right: '10%',
          width: '40vw', height: '40vw',
          border: '2px dashed rgba(124,58,237,0.1)',
          borderRadius: '50%',
          boxShadow: '0 0 60px rgba(124,58,237,0.08)'
        }}
        animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
        transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, scale: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
      />
      
      {/* Aggressive Green Glow */}
      <motion.div
        style={{ 
          position: 'absolute', borderRadius: '50%', filter: 'blur(100px)', 
          width: '40vw', height: '40vw', background: 'rgba(0,245,160,0.08)', 
          bottom: '-15%', left: '30%'
        }}
        animate={{
          scale: [1, 1.3, 0.9, 1.2, 1],
          opacity: [0.6, 1, 0.5, 0.8, 0.6]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
