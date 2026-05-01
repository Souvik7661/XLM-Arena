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

    const count = 40;
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
        ctx.fillStyle = `rgba(6,182,212,${d.alpha})`;
        ctx.fill();
      });
      // Draw connecting lines
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 12100) { // 110 * 110
            const dist = Math.sqrt(distSq);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(6,182,212,${0.07 * (1 - dist / 110)})`;
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
          0%,95%,100% { transform: translate(0); }
          96% { transform: translate(-4px, 2px); }
          97% { transform: translate(4px, -2px); }
          98% { transform: translate(-2px, 1px); }
        }
        @keyframes glitch2 {
          0%,94%,100% { transform: translate(0); opacity: 0; }
          95% { transform: translate(3px, -1px); opacity: 0.6; }
          96.5% { transform: translate(-3px, 2px); opacity: 0.6; }
          97.5% { opacity: 0; }
        }
        @keyframes scanline {
          0% { top: -10%; }
          100% { top: 110%; }
        }
        @keyframes flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
          20%, 24%, 55% { opacity: 0.4; }
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
      <span style={{ color: '#f8fafc', animation: 'glitch1 6s infinite', willChange: 'transform' }}>
        XLM
      </span>
      <span style={{
        background: 'linear-gradient(135deg, #06b6d4 0%, #2dd4bf 50%, #ef4444 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: 'glitch1 2s infinite',
        animationDelay: '0.1s',
        willChange: 'transform',
      }}>
        Arena
      </span>

      {/* Glitch ghost 1 */}
      <div style={{ position: 'absolute', inset: 0, color: '#ef4444', fontWeight: 900, fontSize: 'clamp(3.5rem, 10vw, 6.5rem)', animation: 'glitch2 1.5s infinite', animationDelay: '0.05s', pointerEvents: 'none', willChange: 'transform, opacity' }}>
        XLMArena
      </div>
      {/* Glitch ghost 2 */}
      <div style={{ position: 'absolute', inset: 0, color: '#06b6d4', fontWeight: 900, fontSize: 'clamp(3.5rem, 10vw, 6.5rem)', animation: 'glitch2 1.5s infinite', animationDelay: '0.1s', pointerEvents: 'none', willChange: 'transform, opacity' }}>
        XLMArena
      </div>
    </div>
  );
}

/* ─── Fast HUD Targeting Reticle ─────────────────────────────────── */
function HUDTargetingReticle() {
  return (
    <div style={{ position: 'absolute', width: '600px', height: '600px', opacity: 0.4 }}>
      <style>{`
        @keyframes rapidSpin {
          0% { transform: rotate(0deg); }
          20% { transform: rotate(180deg); }
          25% { transform: rotate(180deg); }
          40% { transform: rotate(360deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes jitter {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(-2px, 1px); }
          40% { transform: translate(1px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(-1px, -1px); }
        }
        @keyframes dataScroll {
          from { background-position: 0 0; }
          to { background-position: 0 -100px; }
        }
      `}</style>
      
      {/* Main outer segmented ring */}
      <div style={{ position: 'absolute', inset: 0, border: '4px dashed rgba(6,182,212,0.3)', borderRadius: '50%', animation: 'rotate360 12s linear infinite', willChange: 'transform' }} />
      <div style={{ position: 'absolute', inset: '10px', border: '1px solid rgba(6,182,212,0.5)', borderRadius: '50%', animation: 'counterRotate 8s linear infinite', willChange: 'transform' }} />
      
      {/* Rapidly spinning target brackets */}
      <div style={{ position: 'absolute', inset: '40px', animation: 'rapidSpin 6s cubic-bezier(0.4, 0, 0.2, 1) infinite', willChange: 'transform' }}>
        {[0, 180].map(deg => (
          <div key={deg} style={{ position: 'absolute', top: '0', left: '50%', width: '120px', height: '40px', borderTop: '4px solid #ef4444', borderLeft: '4px solid #ef4444', borderRight: '4px solid #ef4444', transform: `translateX(-50%) rotate(${deg}deg) translateY(0px)`, transformOrigin: '50% 260px' }} />
        ))}
      </div>

      {/* Crosshairs */}
      <div style={{ position: 'absolute', top: '50%', left: '-50px', right: '-50px', height: '1px', background: 'rgba(6,182,212,0.4)', animation: 'jitter 2s infinite' }} />
      <div style={{ position: 'absolute', left: '50%', top: '-50px', bottom: '-50px', width: '1px', background: 'rgba(6,182,212,0.4)', animation: 'jitter 2s infinite' }} />

      {/* Inner fast rings */}
      <div style={{ position: 'absolute', inset: '120px', border: '6px double rgba(239,68,68,0.4)', borderRadius: '50%', animation: 'rotate360 3s linear infinite', willChange: 'transform' }} />
      <div style={{ position: 'absolute', inset: '140px', borderTop: '4px solid #06b6d4', borderBottom: '4px solid #06b6d4', borderRadius: '50%', animation: 'counterRotate 1.5s linear infinite', willChange: 'transform' }} />

      {/* Center glowing core */}
      <div style={{ position: 'absolute', inset: '260px', background: 'rgba(6,182,212,0.8)', borderRadius: '50%', boxShadow: '0 0 30px #06b6d4', animation: 'flicker 0.1s infinite' }} />
    </div>
  );
}

function HUDDataPanels() {
  const [data, setData] = useState(Array(10).fill('0000'));
  
  useEffect(() => {
    const int = setInterval(() => {
      setData(prev => prev.map(() => Math.random().toString(16).substr(2, 4).toUpperCase()));
    }, 100);
    return () => clearInterval(int);
  }, []);

  return (
    <>
      {/* Left Panel */}
      <div style={{ position: 'absolute', left: '5%', top: '20%', width: '220px', height: '300px', border: '1px solid rgba(6,182,212,0.4)', background: 'rgba(6,182,212,0.05)', padding: '15px', color: '#06b6d4', fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', zIndex: 10, clipPath: 'polygon(0 0, 100% 0, 100% 80%, 80% 100%, 0 100%)', pointerEvents: 'none' }}>
        <div style={{ borderBottom: '1px solid #ef4444', paddingBottom: '5px', marginBottom: '10px', color: '#ef4444', fontWeight: 'bold' }}>SYS_DATA_STREAM</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {data.slice(0,5).map((d, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>SEC_{i}</span>
              <span>0x{d}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '20px', height: '60px', border: '1px solid rgba(239,68,68,0.4)', display: 'flex', alignItems: 'flex-end', gap: '2px', padding: '2px' }}>
          {data.map((d, i) => (
            <motion.div key={i} style={{ flex: 1, background: '#ef4444' }} animate={{ height: [`${Math.random()*100}%`, `${Math.random()*100}%`, `${Math.random()*100}%`] }} transition={{ repeat: Infinity, duration: 0.2 + Math.random()*0.3 }} />
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ position: 'absolute', right: '5%', top: '25%', width: '200px', border: '1px solid rgba(6,182,212,0.4)', background: 'rgba(6,182,212,0.05)', padding: '15px', color: '#06b6d4', fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', zIndex: 10, clipPath: 'polygon(0 0, 80% 0, 100% 20%, 100% 100%, 0 100%)', pointerEvents: 'none' }}>
        <div style={{ borderBottom: '1px solid #06b6d4', paddingBottom: '5px', marginBottom: '10px' }}>TARGET_LOCK</div>
        <div style={{ position: 'relative', width: '100%', height: '100px', border: '1px solid rgba(6,182,212,0.2)', overflow: 'hidden' }}>
           <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 50%, rgba(6,182,212,0.2) 50%)', backgroundSize: '100% 4px', animation: 'dataScroll 1s linear infinite' }} />
           <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: 'linear' }} style={{ position: 'absolute', top: '20px', left: '20px', right: '20px', bottom: '20px', border: '2px dashed #ef4444', borderRadius: '50%' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', marginTop: '10px' }}>
          {data.slice(5).map((d, i) => (
            <div key={i} style={{ background: 'rgba(6,182,212,0.2)', padding: '2px 4px', textAlign: 'center' }}>{d}</div>
          ))}
        </div>
      </div>
    </>
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
          background: 'radial-gradient(ellipse at 30% 80%, rgba(6,182,212,0.06) 0%, transparent 50%), radial-gradient(ellipse at 70% 20%, rgba(239,68,68,0.06) 0%, transparent 50%), #060d18',
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
          background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.6), transparent)',
          animation: 'scanline 4s linear infinite',
          pointerEvents: 'none', zIndex: 1,
        }} />

        {/* Fast HUD Rings (behind content) */}
        <HUDTargetingReticle />
        <HUDDataPanels />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', textAlign: 'center' }}>

          {/* Logo */}
          <motion.img
            src="/favicon.svg"
            alt="XLM Arena"
            initial={{ opacity: 0, scale: 0.3, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            style={{ width: '80px', height: '80px', filter: 'drop-shadow(0 0 20px rgba(6,182,212,0.6))' }}
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
              color: '#06b6d4',
              animation: 'flicker 8s infinite',
            }}
          >
            ◈ ARINO SYSTEM INITIALIZING... ◈
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
            Decentralized esports prediction market on <span style={{ color: '#06b6d4' }}>Stellar</span>
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
            style={{ position: 'absolute', borderColor: 'rgba(6,182,212,0.3)', ...s }}
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
