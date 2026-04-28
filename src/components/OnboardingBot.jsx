import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OnboardingBot({ onDone }) {
  const [step, setStep] = useState(0);
  const [typedText, setTypedText] = useState('');

  const messages = [
    { text: "Hi there! I'm Arino, your AI guide.", expression: 'happy', icon: '👋' },
    { text: "Welcome to XLM Arena, the premier Web3 prediction market.", expression: 'excited', icon: '🏟️' },
    { text: "Back your favorite esports teams and earn XLM rewards effortlessly.", expression: 'happy', icon: '💰' },
    { text: "Transactions are totally gasless! Just connect your wallet.", expression: 'surprised', icon: '⚡' },
    { text: "Ready to dive in? The arena awaits!", expression: 'excited', icon: '🚀' }
  ];

  // Typewriter effect
  useEffect(() => {
    setTypedText('');
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(messages[step].text.slice(0, i + 1));
      i++;
      if (i === messages[step].text.length) clearInterval(interval);
    }, 35);
    return () => clearInterval(interval);
  }, [step]);

  const currentMsg = messages[step];

  // Eye expressions mapping
  const eyeVariants = {
    neutral: { scaleY: [1, 1, 0.1, 1, 1], borderRadius: '50%', scale: 1 },
    happy: { scaleY: 1, borderRadius: '50% 50% 10% 10%', scale: 1, y: -2 },
    surprised: { scaleY: 1.2, borderRadius: '50%', scale: 1.2 },
    excited: { scaleY: [1, 0.8, 1.1, 1], borderRadius: '30%', scale: 1.1, rotate: [0, 10, -10, 0] }
  };

  const btnStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 2px 8px rgba(0,0,0,0.2)',
    color: 'rgba(255,255,255,0.8)',
    fontSize: '0.75rem',
    fontWeight: 600,
    padding: '0.4rem 0.8rem',
    borderRadius: '10px',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
  };

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      flexWrap: 'wrap-reverse', // Stacks on mobile, speech bubble on bottom
      alignItems: 'center',
      justifyContent: 'center',
      gap: '2rem',
      padding: '1rem',
      maxWidth: '100%',
      margin: '0 auto',
      zIndex: 10,
    }}>
      {/* Speech Bubble */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.95, x: -10 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          style={{
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '24px 24px 0 24px',
            padding: '1.25rem 1.5rem',
            minWidth: '280px',
            maxWidth: '320px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
            position: 'relative',
          }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem',
            fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc',
          }}>
            <span style={{ fontSize: '1.3rem' }}>{currentMsg.icon}</span> 
            Arino
          </div>
          <div style={{
            fontSize: '0.95rem',
            color: '#cbd5e1',
            lineHeight: 1.5,
            fontFamily: 'Inter, sans-serif',
            minHeight: '60px',
            marginBottom: '1rem'
          }}>
            {typedText}
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              style={{ display: 'inline-block', width: '6px', height: '14px', background: '#10b981', marginLeft: '4px', verticalAlign: 'middle' }}
            />
          </div>

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <motion.button 
                whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.1)' }} whileTap={{ scale: 0.95 }}
                onClick={() => setStep(s => Math.max(0, s - 1))}
                style={{ ...btnStyle, opacity: step === 0 ? 0.3 : 1, pointerEvents: step === 0 ? 'none' : 'auto' }}
              >
                ← Prev
              </motion.button>
              
              {step < messages.length - 1 ? (
                <motion.button 
                  whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.1)' }} whileTap={{ scale: 0.95 }}
                  onClick={() => setStep(s => Math.min(messages.length - 1, s + 1))}
                  style={{ ...btnStyle, background: 'rgba(16,185,129,0.15)', borderColor: 'rgba(16,185,129,0.3)', color: '#10b981' }}
                >
                  Next →
                </motion.button>
              ) : (
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(16,185,129,0.4)' }} whileTap={{ scale: 0.95 }}
                  onClick={onDone}
                  style={{ ...btnStyle, background: 'linear-gradient(135deg, #10b981, #3b82f6)', border: 'none', color: '#fff' }}
                >
                  Enter Arena 🚀
                </motion.button>
              )}
            </div>

            {step < messages.length - 1 && (
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={onDone}
                style={{ ...btnStyle, background: 'transparent', border: 'none', boxShadow: 'none', color: 'rgba(255,255,255,0.4)', padding: '0.4rem' }}
              >
                Skip
              </motion.button>
            )}
          </div>

          {/* Speech bubble tail */}
          <div style={{
            position: 'absolute', right: '-12px', bottom: '20px',
            width: 0, height: 0,
            borderLeft: '12px solid rgba(15, 23, 42, 0.65)',
            borderTop: '12px solid transparent',
            borderBottom: '12px solid transparent',
          }} />
        </motion.div>
      </AnimatePresence>

      {/* Robot Character */}
      <motion.div
        animate={{ y: [-8, 8, -8] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        style={{ position: 'relative', width: '140px', height: '180px' }}
      >
        {/* Glow behind bot */}
        <div style={{
          position: 'absolute', inset: '-20px',
          background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)',
          filter: 'blur(20px)', zIndex: 0
        }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Head */}
          <div style={{
            width: '100px', height: '70px',
            background: 'linear-gradient(135deg, #f8fafc, #cbd5e1)',
            borderRadius: '40px',
            position: 'relative',
            boxShadow: 'inset -4px -4px 10px rgba(0,0,0,0.2), 0 10px 20px rgba(0,0,0,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {/* Visor */}
            <div style={{
              width: '80px', height: '44px',
              background: '#0f172a',
              borderRadius: '22px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.8)'
            }}>
              {/* Visor reflection */}
              <div style={{
                position: 'absolute', top: '2px', left: '10%', right: '10%', height: '12px',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.2), transparent)',
                borderRadius: '10px'
              }} />

              {/* Eyes */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '12px' }}>
                <motion.div
                  animate={eyeVariants[currentMsg.expression]}
                  transition={currentMsg.expression === 'neutral' ? { repeat: Infinity, duration: 3, times: [0, 0.9, 0.95, 0.98, 1] } : { duration: 0.3 }}
                  style={{ width: '16px', height: '16px', background: '#0ea5e9', boxShadow: '0 0 15px #0ea5e9' }}
                />
                <motion.div
                  animate={eyeVariants[currentMsg.expression]}
                  transition={currentMsg.expression === 'neutral' ? { repeat: Infinity, duration: 3, times: [0, 0.9, 0.95, 0.98, 1] } : { duration: 0.3 }}
                  style={{ width: '16px', height: '16px', background: '#0ea5e9', boxShadow: '0 0 15px #0ea5e9' }}
                />
              </div>
            </div>

            {/* Ears */}
            <div style={{ position: 'absolute', left: '-6px', top: '25px', width: '8px', height: '20px', background: '#94a3b8', borderRadius: '4px' }} />
            <div style={{ position: 'absolute', right: '-6px', top: '25px', width: '8px', height: '20px', background: '#94a3b8', borderRadius: '4px' }} />
          </div>

          {/* Neck */}
          <div style={{ width: '20px', height: '8px', background: '#475569', margin: '2px 0' }} />

          {/* Body */}
          <div style={{
            width: '80px', height: '60px',
            background: 'linear-gradient(135deg, #f8fafc, #94a3b8)',
            borderRadius: '24px',
            position: 'relative',
            boxShadow: 'inset -4px -4px 10px rgba(0,0,0,0.2), 0 10px 20px rgba(0,0,0,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {/* Core engine */}
            <motion.div
              animate={{ opacity: [0.6, 1, 0.6], scale: currentMsg.expression === 'excited' ? [1, 1.2, 1] : 1 }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#0ea5e9', boxShadow: '0 0 20px #0ea5e9', border: '3px solid #0f172a' }}
            />

            {/* Arms */}
            <motion.div 
              animate={{ rotate: currentMsg.expression === 'happy' || currentMsg.expression === 'excited' ? [-15, -40, -15] : 15 }}
              transition={{ repeat: Infinity, duration: 1 }}
              style={{ position: 'absolute', left: '-16px', top: '10px', width: '20px', height: '40px', background: '#cbd5e1', borderRadius: '10px', transformOrigin: 'top center', boxShadow: 'inset -2px -2px 5px rgba(0,0,0,0.2)' }} 
            />
            <motion.div 
              animate={{ rotate: currentMsg.expression === 'excited' ? [-15, 15, -15] : -15 }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{ position: 'absolute', right: '-16px', top: '10px', width: '20px', height: '40px', background: '#cbd5e1', borderRadius: '10px', transformOrigin: 'top center', boxShadow: 'inset -2px -2px 5px rgba(0,0,0,0.2)' }} 
            />
          </div>

          {/* Jet Thruster */}
          <div style={{
            width: '30px', height: '10px',
            background: '#334155',
            borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px',
            marginTop: '2px', position: 'relative', display: 'flex', justifyContent: 'center'
          }}>
            <motion.div
              animate={{ height: ['40px', '55px', '40px'], opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 0.4 }}
              style={{
                position: 'absolute', top: '10px', width: '16px',
                background: 'linear-gradient(180deg, #3b82f6 0%, #06b6d4 50%, transparent 100%)',
                filter: 'blur(4px)', borderRadius: '8px'
              }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
