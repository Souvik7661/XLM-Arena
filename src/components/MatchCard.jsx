import React from 'react';
import { computeOdds } from '../utils/contractClient';
import { motion } from 'framer-motion';

export default function MatchCard({ match, onSelect }) {
  const oddsA = computeOdds(match, 'A');
  const oddsB = computeOdds(match, 'B');

  const totalPool = match.poolA + match.poolB;
  const pctA = totalPool === 0 ? 50 : (match.poolA / totalPool) * 100;

  return (
    <motion.div 
      className={`match-card ${match.featured ? 'featured' : ''}`} 
      onClick={() => onSelect(match)}
      whileHover={{ y: -8, scale: 1.03, boxShadow: '0 0 30px rgba(0,245,160,0.4), inset 0 0 20px rgba(0,245,160,0.1)', transition: { type: "spring", stiffness: 400, damping: 15 } }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="card-header">
        <div className="card-game">
          <span className="card-game-icon">{match.gameIcon}</span>
          <span>{match.game}</span>
          <span style={{ margin: '0 4px', color: 'var(--border)' }}>|</span>
          <span className="card-tournament">{match.tournament}</span>
        </div>
        <div className={`status-badge ${match.status === 'live' ? 'status-live' : 'status-upcoming'}`}>
          {match.status === 'live' ? (
            <>
              <motion.div className="live-dot" animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: 6, height: 6, display: 'inline-block' }}></motion.div>
              LIVE
            </>
          ) : (
            'UPCOMING'
          )}
        </div>
      </div>

      <div className="teams-row">
        <div className="team">
          <motion.div className="team-logo" whileHover={{ scale: 1.3, rotate: [0, -15, 10, -10, 0], transition: { duration: 0.4 } }}>{match.teamA.logo}</motion.div>
          <div className="team-short">{match.teamA.short}</div>
          <div className="team-region">{match.teamA.region}</div>
        </div>

        <div className="vs-divider">
          <motion.div className="vs-text" animate={{ opacity: [0.5, 1, 0.5], textShadow: ["0 0 0px var(--neon)", "0 0 10px var(--neon)", "0 0 0px var(--neon)"] }} transition={{ duration: 2, repeat: Infinity }}>VS</motion.div>
          {match.status === 'upcoming' && (
            <div className="vs-time">
              {new Date(match.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>

        <div className="team">
          <motion.div className="team-logo" whileHover={{ scale: 1.3, rotate: [0, 15, -10, 10, 0], transition: { duration: 0.4 } }}>{match.teamB.logo}</motion.div>
          <div className="team-short">{match.teamB.short}</div>
          <div className="team-region">{match.teamB.region}</div>
        </div>
      </div>

      <div className="pool-section">
        <div className="pool-labels" style={{ marginBottom: '0.4rem' }}>
          <span className="pool-label-a">{match.teamA.short} ({pctA.toFixed(0)}%)</span>
          <span className="pool-label-b">{match.teamB.short} ({(100 - pctA).toFixed(0)}%)</span>
        </div>
        <div className="pool-bar-wrap">
          <motion.div 
            className="pool-bar-fill" 
            initial={{ width: 0 }}
            animate={{ width: `${pctA}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          ></motion.div>
        </div>
      </div>

      <div className="card-footer">
        <div className="odds-chips">
          <motion.div className="odds-chip" whileHover={{ scale: 1.1, boxShadow: "0 0 15px var(--neon)" }}>{oddsA}x</motion.div>
          <motion.div className="odds-chip" style={{ background: 'rgba(0,217,245,0.08)', color: 'var(--neon2)', borderColor: 'rgba(0,217,245,0.2)' }} whileHover={{ scale: 1.1, boxShadow: "0 0 15px var(--neon2)" }}>
            {oddsB}x
          </motion.div>
        </div>
        <div className="total-pool">Pool: <b>{totalPool} XLM</b></div>
      </div>
    </motion.div>
  );
}
