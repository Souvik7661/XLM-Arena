import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OnboardingBot({ onDone }) {
  const [step, setStep] = useState(0);
  const [typedText, setTypedText] = useState('');

  const messages = [
    { text: "Greetings. I am ARINO, your AI system.", expression: 'happy', icon: '🤖' },
    { text: "Welcome to XLM Arena, the premier Web3 prediction market.", expression: 'excited', icon: '🏟️' },
    { text: "Back your favorite esports teams and earn XLM rewards.", expression: 'happy', icon: '💰' },
    { text: "Transactions are totally gasless. Just connect your wallet.", expression: 'surprised', icon: '⚡' },
    { text: "All systems are go. The arena awaits!", expression: 'excited', icon: '🚀' }
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
    neutral: { scaleY: [1, 1, 0.2, 1, 1], borderRadius: '2px', scale: 1 },
    happy: { scaleY: 1, borderRadius: '2px 2px 6px 6px', scale: 1, y: -1 },
    surprised: { scaleY: 1.2, borderRadius: '2px', scale: 1.2 },
    excited: { scaleY: [1, 0.8, 1.1, 1], borderRadius: '2px', scale: 1.1, rotate: [0, 5, -5, 0] }
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
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)',
            letterSpacing: '0.01em', marginBottom: '0.4rem', }}>
            <span style={{ fontSize: '1.3rem' }}>{currentMsg.icon}</span> 
            ARINO
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
              style={{ display: 'inline-block', width: '6px', height: '14px', background: '#06b6d4', marginLeft: '4px', verticalAlign: 'middle' }}
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
                  style={{ ...btnStyle, background: 'rgba(6,182,212,0.15)', borderColor: 'rgba(6,182,212,0.3)', color: '#06b6d4' }}
                >
                  Next →
                </motion.button>
              ) : (
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(6,182,212,0.4)' }} whileTap={{ scale: 0.95 }}
                  onClick={onDone}
                  style={{ ...btnStyle, background: 'linear-gradient(135deg, #06b6d4, #2dd4bf)', border: 'none', color: '#fff' }}
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

      {/* Iron Man Character */}
      <motion.div
        animate={{ y: [-8, 8, -8] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        style={{ position: 'relative', width: '140px', height: '180px' }}
      >
        {/* Glow behind bot */}
        <div style={{
          position: 'absolute', inset: '-20px',
          background: 'radial-gradient(circle, rgba(239,68,68,0.3) 0%, transparent 70%)',
          filter: 'blur(20px)', zIndex: 0
        }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Iron Man Helmet */}
          <div style={{
            width: '90px', height: '100px',
            background: 'linear-gradient(135deg, #dc2626, #991b1b)',
            borderRadius: '40px 40px 30px 30px',
            position: 'relative',
            boxShadow: 'inset -4px -4px 10px rgba(0,0,0,0.4), 0 10px 20px rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden'
          }}>
            {/* Gold Faceplate */}
            <div style={{
              position: 'absolute', top: '15px', left: '10px', right: '10px', bottom: '15px',
              background: 'linear-gradient(135deg, #fbbf24, #b45309)',
              borderRadius: '20px 20px 25px 25px',
              clipPath: 'polygon(20% 0%, 80% 0%, 100% 30%, 90% 100%, 50% 90%, 10% 100%, 0% 30%)',
              boxShadow: 'inset 0 4px 10px rgba(255,255,255,0.4), inset -2px -4px 8px rgba(0,0,0,0.3)',
              display: 'flex', flexDirection: 'column', alignItems: 'center'
            }}>
              {/* Brow lines */}
              <div style={{ width: '40px', height: '2px', background: 'rgba(0,0,0,0.1)', marginTop: '8px', borderRadius: '1px' }} />
              
              {/* Eyes */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginTop: '12px' }}>
                <motion.div
                  animate={eyeVariants[currentMsg.expression]}
                  transition={currentMsg.expression === 'neutral' ? { repeat: Infinity, duration: 3, times: [0, 0.9, 0.95, 0.98, 1] } : { duration: 0.3 }}
                  style={{ width: '18px', height: '8px', background: '#ccfbf1', boxShadow: '0 0 15px #06b6d4, 0 0 5px #fff', borderRadius: '2px', transform: 'skewY(5deg)' }}
                />
                <motion.div
                  animate={eyeVariants[currentMsg.expression]}
                  transition={currentMsg.expression === 'neutral' ? { repeat: Infinity, duration: 3, times: [0, 0.9, 0.95, 0.98, 1] } : { duration: 0.3 }}
                  style={{ width: '18px', height: '8px', background: '#ccfbf1', boxShadow: '0 0 15px #06b6d4, 0 0 5px #fff', borderRadius: '2px', transform: 'skewY(-5deg)' }}
                />
              </div>

              {/* Mouth/Grill lines */}
              <div style={{ display: 'flex', gap: '4px', marginTop: '22px' }}>
                <div style={{ width: '2px', height: '6px', background: 'rgba(0,0,0,0.3)' }} />
                <div style={{ width: '2px', height: '8px', background: 'rgba(0,0,0,0.3)' }} />
                <div style={{ width: '2px', height: '6px', background: 'rgba(0,0,0,0.3)' }} />
              </div>
            </div>

            {/* Side earpieces */}
            <div style={{ position: 'absolute', left: '-2px', top: '40px', width: '6px', height: '20px', background: '#b45309', borderRadius: '3px' }} />
            <div style={{ position: 'absolute', right: '-2px', top: '40px', width: '6px', height: '20px', background: '#b45309', borderRadius: '3px' }} />
          </div>

          {/* Neck */}
          <div style={{ width: '24px', height: '12px', background: 'linear-gradient(90deg, #1f2937, #334155, #1f2937)', margin: '0' }} />

          {/* Upper Body/Chest */}
          <div style={{
            width: '100px', height: '65px',
            background: 'linear-gradient(135deg, #dc2626, #7f1d1d)',
            borderRadius: '30px 30px 20px 20px',
            position: 'relative',
            boxShadow: 'inset -4px -4px 10px rgba(0,0,0,0.4), 0 10px 20px rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {/* Gold accents */}
            <div style={{ position: 'absolute', top: '10px', left: '15px', width: '15px', height: '30px', background: 'linear-gradient(135deg, #fbbf24, #b45309)', borderRadius: '5px', clipPath: 'polygon(0 0, 100% 20%, 100% 100%, 0 80%)' }} />
            <div style={{ position: 'absolute', top: '10px', right: '15px', width: '15px', height: '30px', background: 'linear-gradient(135deg, #fbbf24, #b45309)', borderRadius: '5px', clipPath: 'polygon(0 20%, 100% 0, 100% 80%, 0 100%)' }} />

            {/* Arc Reactor (Chest) */}
            <motion.div
              animate={{ opacity: [0.8, 1, 0.8], scale: currentMsg.expression === 'excited' ? [1, 1.1, 1] : 1 }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ccfbf1', boxShadow: '0 0 20px #06b6d4, inset 0 0 10px #06b6d4', border: '3px solid #cbd5e1' }}
            >
              <div style={{ width: '100%', height: '100%', border: '2px dashed #06b6d4', borderRadius: '50%', animation: 'rotate360 4s linear infinite' }} />
            </motion.div>

            {/* Arms */}
            <motion.div 
              animate={{ rotate: currentMsg.expression === 'happy' || currentMsg.expression === 'excited' ? [-10, -30, -10] : 10 }}
              transition={{ repeat: Infinity, duration: 1 }}
              style={{ position: 'absolute', left: '-20px', top: '10px', width: '22px', height: '50px', background: 'linear-gradient(135deg, #dc2626, #991b1b)', borderRadius: '11px', transformOrigin: 'top center', boxShadow: 'inset -2px -2px 5px rgba(0,0,0,0.4)' }} 
            />
            <motion.div 
              animate={{ rotate: currentMsg.expression === 'excited' ? [-10, 10, -10] : -10 }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{ position: 'absolute', right: '-20px', top: '10px', width: '22px', height: '50px', background: 'linear-gradient(135deg, #dc2626, #991b1b)', borderRadius: '11px', transformOrigin: 'top center', boxShadow: 'inset -2px -2px 5px rgba(0,0,0,0.4)' }} 
            />
          </div>

          {/* Jet Thruster Glow */}
          <div style={{
            width: '40px', height: '15px',
            position: 'relative', display: 'flex', justifyContent: 'center'
          }}>
            <motion.div
              animate={{ height: ['40px', '60px', '40px'], opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 0.3 }}
              style={{
                position: 'absolute', top: '0', width: '24px',
                background: 'linear-gradient(180deg, #06b6d4 0%, #2dd4bf 40%, transparent 100%)',
                filter: 'blur(5px)', borderRadius: '12px'
              }}
            />
            <motion.div
              animate={{ height: ['25px', '40px', '25px'], opacity: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 0.2 }}
              style={{
                position: 'absolute', top: '0', width: '12px',
                background: 'linear-gradient(180deg, #ffffff 0%, #ccfbf1 50%, transparent 100%)',
                filter: 'blur(2px)', borderRadius: '6px'
              }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
