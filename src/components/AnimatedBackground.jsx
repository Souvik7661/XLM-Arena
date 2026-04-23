import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -1, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Infinite scrolling grid overlay */}
      <motion.div 
        style={{
          position: 'absolute',
          top: '-10%', left: '-10%', width: '120%', height: '120%',
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), 
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
        animate={{
          y: [0, 50],
          x: [0, 50]
        }}
        transition={{
          repeat: Infinity,
          duration: 10,
          ease: "linear"
        }}
      />
      
      {/* Drift blobs - purple */}
      <motion.div
        style={{ 
          position: 'absolute', borderRadius: '50%', filter: 'blur(130px)', 
          width: '45vw', height: '45vw', background: 'rgba(124,58,237,0.08)',
          top: '-10%', left: '-10%'
        }}
        animate={{
          x: ['0%', '15%', '0%', '-10%', '0%'],
          y: ['0%', '10%', '-10%', '5%', '0%'],
          scale: [1, 1.05, 0.95, 1.1, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Drift blobs - neon green */}
      <motion.div
        style={{ 
          position: 'absolute', borderRadius: '50%', filter: 'blur(130px)', 
          width: '40vw', height: '40vw', background: 'rgba(0,245,160,0.06)', 
          bottom: '-15%', right: '-5%'
        }}
        animate={{
          x: ['0%', '-15%', '5%', '-10%', '0%'],
          y: ['0%', '-20%', '10%', '-5%', '0%'],
          scale: [1, 1.1, 0.9, 1.05, 1]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Drift blobs - blue/cyan */}
      <motion.div
        style={{ 
          position: 'absolute', borderRadius: '50%', filter: 'blur(120px)', 
          width: '30vw', height: '30vw', background: 'rgba(0,217,245,0.05)', 
          left: '35%', top: '30%'
        }}
        animate={{
          x: ['0%', '20%', '-10%', '15%', '0%'],
          y: ['0%', '-15%', '20%', '-10%', '0%'],
          scale: [1, 1.15, 0.85, 1.1, 1]
        }}
        transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
