import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OnboardingBot from './OnboardingBot';

/* ─── Particle Canvas ─────────────────────────────────────── */
function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const count = 80;
    const dots = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.4,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.5 + 0.15,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0) d.x = canvas.width;
        if (d.x > canvas.width) d.x = 0;
        if (d.y < 0) d.y = canvas.height;
        if (d.y > canvas.height) d.y = 0;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16,185,129,${d.alpha})`;
        ctx.fill();
      });
      // Draw connecting lines
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(16,185,129,${0.07 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }} />;
}

/* ─── Glitch Text ─────────────────────────────────────────── */
function GlitchTitle() {
  return (
    <div style={{ position: 'relative', fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: 'clamp(3.5rem, 10vw, 6.5rem)', lineHeight: 1, letterSpacing: '-0.03em', userSelect: 'none' }}>
      <style>{`
        @keyframes glitch1 {
          0%,95%,100% { clip-path: none; transform: translate(0); }
          96% { clip-path: polygon(0 10%, 100% 10%, 100% 40%, 0 40%); transform: translate(-4px, 2px); }
          97% { clip-path: polygon(0 55%, 100% 55%, 100% 75%, 0 75%); transform: translate(4px, -2px); }
          98% { clip-path: polygon(0 25%, 100% 25%, 100% 35%, 0 35%); transform: translate(-2px, 1px); }
        }
        @keyframes glitch2 {
          0%,94%,100% { clip-path: none; transform: translate(0); opacity: 0; }
          95% { clip-path: polygon(0 20%, 100% 20%, 100% 45%, 0 45%); transform: translate(3px, -1px); opacity: 0.6; }
          96.5% { clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%); transform: translate(-3px, 2px); opacity: 0.6; }
          97.5% { opacity: 0; }
        }
        @keyframes scanline {
          0% { top: -10%; }
          100% { top: 110%; }
        }
        @keyframes borderPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes neonPulse {
          0%, 100% { text-shadow: 0 0 10px rgba(16,185,129,0.4), 0 0 20px rgba(16,185,129,0.2); }
          50% { text-shadow: 0 0 20px rgba(16,185,129,0.8), 0 0 40px rgba(16,185,129,0.4), 0 0 60px rgba(59,130,246,0.2); }
        }
        @keyframes flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
          20%, 24%, 55% { opacity: 0.4; }
        }
        @keyframes enterPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.4), 0 0 20px rgba(16,185,129,0.2); }
          50% { box-shadow: 0 0 0 8px rgba(16,185,129,0), 0 0 40px rgba(16,185,129,0.5); }
        }
        @keyframes rotate360 {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes counterRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
      `}</style>

      {/* Main text */}
      <span style={{ color: '#f8fafc', animation: 'glitch1 6s infinite, neonPulse 3s ease-in-out infinite' }}>
        XLM
      </span>
      <span style={{
        background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #3b82f6 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: 'glitch1 6s infinite',
        animationDelay: '0.1s',
      }}>
        Arena
      </span>

      {/* Glitch ghost 1 */}
      <div style={{ position: 'absolute', inset: 0, color: '#10b981', fontWeight: 900, fontSize: 'clamp(3.5rem, 10vw, 6.5rem)', animation: 'glitch2 6s infinite', animationDelay: '0.05s', pointerEvents: 'none' }}>
        XLMArena
      </div>
      {/* Glitch ghost 2 */}
      <div style={{ position: 'absolute', inset: 0, color: '#3b82f6', fontWeight: 900, fontSize: 'clamp(3.5rem, 10vw, 6.5rem)', animation: 'glitch2 6s infinite', animationDelay: '0.1s', pointerEvents: 'none' }}>
        XLMArena
      </div>
    </div>
  );
}

/* ─── Hex ring decoration ─────────────────────────────────── */
function HexRing() {
  return (
    <div style={{ position: 'absolute', width: '520px', height: '520px', opacity: 0.12 }}>
      <div style={{ position: 'absolute', inset: 0, border: '1px solid #10b981', borderRadius: '50%', animation: 'rotate360 20s linear infinite' }}>
        {[0,60,120,180,240,300].map(deg => (
          <div key={deg} style={{ position: 'absolute', top: '50%', left: '50%', width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', transform: `rotate(${deg}deg) translateX(258px) translateY(-50%)` }} />
        ))}
      </div>
      <div style={{ position: 'absolute', inset: '40px', border: '1px solid #3b82f6', borderRadius: '50%', animation: 'counterRotate 15s linear infinite' }}>
        {[0,90,180,270].map(deg => (
          <div key={deg} style={{ position: 'absolute', top: '50%', left: '50%', width: '5px', height: '5px', background: '#3b82f6', borderRadius: '50%', transform: `rotate(${deg}deg) translateX(218px) translateY(-50%)` }} />
        ))}
      </div>
      <div style={{ position: 'absolute', inset: '80px', border: '0.5px solid rgba(16,185,129,0.5)', borderRadius: '50%', animation: 'rotate360 8s linear infinite' }} />
    </div>
  );
}

// BootText removed in favor of OnboardingBot

/* ─── Main Splash Screen ──────────────────────────────────── */
export default function SplashScreen({ onDone }) {
  const [exiting, setExiting] = useState(false);

  const handleEnter = () => {
    setExiting(true);
    setTimeout(onDone, 900);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="splash"
        initial={{ opacity: 0 }}
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={{ duration: exiting ? 0.9 : 0.6, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'radial-gradient(ellipse at 30% 80%, rgba(16,185,129,0.06) 0%, transparent 50%), radial-gradient(ellipse at 70% 20%, rgba(59,130,246,0.06) 0%, transparent 50%), #060d18',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0',
          overflow: 'hidden',
        }}
      >
        {/* Animated particles */}
        <ParticleCanvas />

        {/* Scan line sweep */}
        <div style={{
          position: 'absolute', left: 0, right: 0, height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.6), transparent)',
          animation: 'scanline 4s linear infinite',
          pointerEvents: 'none', zIndex: 1,
        }} />

        {/* Hex ring (behind content) */}
        <HexRing />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', textAlign: 'center' }}>

          {/* Logo */}
          <motion.img
            src="/favicon.svg"
            alt="XLM Arena"
            initial={{ opacity: 0, scale: 0.3, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            style={{ width: '80px', height: '80px', filter: 'drop-shadow(0 0 20px rgba(16,185,129,0.6))' }}
          />

          {/* Welcome label */}
          <motion.div
            initial={{ opacity: 0, letterSpacing: '12px' }}
            animate={{ opacity: 1, letterSpacing: '5px' }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '5px',
              textTransform: 'uppercase',
              color: '#10b981',
              animation: 'flicker 8s infinite',
            }}
          >
            ◈ Welcome to ◈
          </motion.div>

          {/* Glitch Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.95 }}
          >
            <GlitchTitle />
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 1.3 }}
            style={{
              color: '#475569',
              fontSize: '0.95rem',
              fontFamily: "'Inter', sans-serif",
              margin: 0,
              maxWidth: '360px',
              lineHeight: 1.6,
            }}
          >
            Decentralized esports prediction market on <span style={{ color: '#10b981' }}>Stellar</span>
          </motion.p>

          {/* AI Onboarding Bot */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.5 }}
            style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}
          >
            <OnboardingBot onDone={handleEnter} />
          </motion.div>
        </div>

        {/* Corner decorations */}
        {[
          { top: '1.5rem', left: '1.5rem', borderTop: '1px solid', borderLeft: '1px solid', width: '30px', height: '30px' },
          { top: '1.5rem', right: '1.5rem', borderTop: '1px solid', borderRight: '1px solid', width: '30px', height: '30px' },
          { bottom: '1.5rem', left: '1.5rem', borderBottom: '1px solid', borderLeft: '1px solid', width: '30px', height: '30px' },
          { bottom: '1.5rem', right: '1.5rem', borderBottom: '1px solid', borderRight: '1px solid', width: '30px', height: '30px' },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
            style={{ position: 'absolute', borderColor: 'rgba(16,185,129,0.3)', ...s }}
          />
        ))}

        {/* Bottom label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1 }}
          style={{ position: 'absolute', bottom: '1.25rem', fontSize: '0.6rem', color: '#1e293b', fontFamily: "'Space Mono', monospace", letterSpacing: '3px', zIndex: 2 }}
        >
          POWERED BY STELLAR BLOCKCHAIN
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
