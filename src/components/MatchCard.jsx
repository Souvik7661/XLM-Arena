import React, { useRef, useState } from 'react';
import { computeOdds } from '../utils/contractClient';
import { motion } from 'framer-motion';

export default function MatchCard({ match, onSelect }) {
  const cardRef = useRef(null);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  const oddsA = computeOdds(match, 'A');
  const oddsB = computeOdds(match, 'B');
  const totalPool = match.poolA + match.poolB;
  const pctA = totalPool === 0 ? 50 : (match.poolA / totalPool) * 100;

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlowPos({ x, y });
  };

  return (
    <motion.div
      ref={cardRef}
      onClick={() => onSelect(match)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{
        position: 'relative',
        background: hovered
          ? 'rgba(255,255,255,0.07)'
          : 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: hovered
          ? '1px solid rgba(168,85,247,0.4)'
          : '1px solid rgba(255,255,255,0.05)',
        borderRadius: '20px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'background 0.3s ease, border 0.3s ease',
        boxShadow: hovered
          ? '0 20px 60px rgba(0,0,0,0.5), 0 0 15px rgba(168,85,247,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
          : '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {/* Mouse-follow spotlight */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: hovered
          ? `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(168,85,247,0.12) 0%, transparent 60%)`
          : 'none',
        transition: 'opacity 0.2s',
        pointerEvents: 'none',
        zIndex: 0,
        borderRadius: '20px',
      }} />

      {/* Top glass shine */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* Featured badge */}
      {match.featured && (
        <div style={{
          position: 'absolute', top: 0, right: 0, zIndex: 3,
          background: 'linear-gradient(135deg, #f43f5e, #a855f7)',
          color: '#fff', fontSize: '0.6rem', fontWeight: 800,
          padding: '0.3rem 0.8rem',
          borderBottomLeftRadius: '10px',
          letterSpacing: '1px',
        }}>
          FEATURED
        </div>
      )}

      {/* Content wrapper */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        
        {/* Banner Image */}
        <div style={{ width: '100%', height: '180px', overflow: 'hidden', position: 'relative' }}>
           <motion.img 
             src="/card.png" 
             alt="Cyberpunk Card"
             style={{ width: '100%', height: '100%', objectFit: 'cover' }}
             whileHover={{ scale: 1.05 }}
             transition={{ duration: 0.5, ease: "easeOut" }}
           />
           <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,5,18,1) 0%, rgba(10,5,18,0) 100%)' }} />
        </div>

        {/* Card header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 1.25rem 0.75rem',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          marginTop: '-1rem',
          position: 'relative', zIndex: 3
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>
            <span style={{ fontSize: '1rem' }}>{match.gameIcon}</span>
            <span style={{ fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>{match.game}</span>
            <span style={{ opacity: 0.3 }}>|</span>
            <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{match.tournament}</span>
          </div>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
            padding: '0.2rem 0.65rem', borderRadius: '20px', fontSize: '0.65rem',
            fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase',
            ...(match.status === 'live'
              ? { background: 'rgba(239,68,68,0.15)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)' }
              : { background: 'rgba(251,191,36,0.12)', color: '#fde68a', border: '1px solid rgba(251,191,36,0.25)' })
          }}>
            {match.status === 'live' && (
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                style={{ width: 6, height: 6, borderRadius: '50%', background: '#f43f5e' }}
              />
            )}
            {match.status === 'live' ? 'LIVE' : 'UPCOMING'}
          </div>
        </div>

        {/* Teams */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 1.25rem 1.1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', flex: 1 }}>
            <motion.div
              whileHover={{ scale: 1.3, rotate: [0, -12, 10, -8, 0] }}
              transition={{ duration: 0.4 }}
              style={{ fontSize: '2.4rem', filter: 'drop-shadow(0 4px 12px rgba(244,63,94,0.3))' }}
            >
              {match.teamA.logo}
            </motion.div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#f8fafc', letterSpacing: '-0.01em' }}>{match.teamA.short}</div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{match.teamA.region}</div>
            <div style={{
              fontSize: '0.7rem', fontWeight: 700,
              background: 'linear-gradient(135deg, #f43f5e, #a855f7)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>{oddsA}x</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', padding: '0 1rem' }}>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5], textShadow: ['0 0 0px #a855f7', '0 0 12px #a855f7', '0 0 0px #a855f7'] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ fontWeight: 900, fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '1px' }}
            >
              VS
            </motion.div>
            {match.status === 'upcoming' && (
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>
                {new Date(match.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', flex: 1 }}>
            <motion.div
              whileHover={{ scale: 1.3, rotate: [0, 12, -10, 8, 0] }}
              transition={{ duration: 0.4 }}
              style={{ fontSize: '2.4rem', filter: 'drop-shadow(0 4px 12px rgba(168,85,247,0.3))' }}
            >
              {match.teamB.logo}
            </motion.div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#f8fafc', letterSpacing: '-0.01em' }}>{match.teamB.short}</div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{match.teamB.region}</div>
            <div style={{
              fontSize: '0.7rem', fontWeight: 700,
              background: 'linear-gradient(135deg, #a855f7, #b026ff)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>{oddsB}x</div>
          </div>
        </div>

        {/* Pool bar */}
        <div style={{ padding: '0 1.25rem 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem' }}>
            <span style={{ fontWeight: 600 }}>{match.teamA.short} {pctA.toFixed(0)}%</span>
            <span style={{ fontWeight: 600 }}>{match.teamB.short} {(100 - pctA).toFixed(0)}%</span>
          </div>
          <div style={{ height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pctA}%` }}
              transition={{ type: 'spring', stiffness: 80, damping: 18 }}
              style={{ height: '100%', background: 'linear-gradient(90deg, #f43f5e, #a855f7)', borderRadius: '3px' }}
            />
          </div>
        </div>

        {/* Predict Action */}
        <div style={{
          padding: '1.25rem',
          display: 'flex', justifyContent: 'center'
        }}>
           <motion.button 
             className="btn btn-primary glass-refractive" 
             style={{ 
               width: '100%', 
               justifyContent: 'center', 
               background: 'rgba(168,85,247,0.1)', 
               borderColor: 'rgba(168,85,247,0.4)',
               boxShadow: 'inset 0 0 15px rgba(168,85,247,0.3), 0 0 15px rgba(168,85,247,0.3), inset 0 1px 1px rgba(255,255,255,0.3)'
             }}
           >
             Place Prediction
           </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
