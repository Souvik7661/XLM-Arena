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
          ? '1px solid rgba(16,185,129,0.4)'
          : '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'background 0.3s ease, border 0.3s ease',
        boxShadow: hovered
          ? '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(16,185,129,0.1), inset 0 1px 0 rgba(255,255,255,0.1)'
          : '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {/* Mouse-follow spotlight */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: hovered
          ? `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(16,185,129,0.12) 0%, transparent 60%)`
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
          background: 'linear-gradient(135deg, #10b981, #3b82f6)',
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

        {/* Card header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1rem 1.25rem 0.75rem',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
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
                style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }}
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
              style={{ fontSize: '2.4rem', filter: 'drop-shadow(0 4px 12px rgba(16,185,129,0.3))' }}
            >
              {match.teamA.logo}
            </motion.div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#f8fafc', letterSpacing: '-0.01em' }}>{match.teamA.short}</div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{match.teamA.region}</div>
            <div style={{
              fontSize: '0.7rem', fontWeight: 700,
              background: 'linear-gradient(135deg, #10b981, #3b82f6)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>{oddsA}x</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', padding: '0 1rem' }}>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5], textShadow: ['0 0 0px #10b981', '0 0 12px #10b981', '0 0 0px #10b981'] }}
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
              style={{ fontSize: '2.4rem', filter: 'drop-shadow(0 4px 12px rgba(59,130,246,0.3))' }}
            >
              {match.teamB.logo}
            </motion.div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#f8fafc', letterSpacing: '-0.01em' }}>{match.teamB.short}</div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{match.teamB.region}</div>
            <div style={{
              fontSize: '0.7rem', fontWeight: 700,
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
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
              style={{ height: '100%', background: 'linear-gradient(90deg, #10b981, #3b82f6)', borderRadius: '3px' }}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.75rem 1.25rem',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(0,0,0,0.15)',
        }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[
              { label: `${match.teamA.short}`, val: `${oddsA}x`, from: '#10b981', to: '#06b6d4' },
              { label: `${match.teamB.short}`, val: `${oddsB}x`, from: '#3b82f6', to: '#8b5cf6' },
            ].map((chip, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.08, y: -1 }}
                style={{
                  padding: '0.2rem 0.6rem', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 700,
                  background: `linear-gradient(135deg, ${chip.from}22, ${chip.to}22)`,
                  border: `1px solid ${chip.from}44`,
                  color: chip.from,
                  cursor: 'default',
                }}
              >
                {chip.val}
              </motion.div>
            ))}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>
            Pool: <span style={{ fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>{totalPool} XLM</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
