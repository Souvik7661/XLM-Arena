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
      whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
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
              <div className="live-dot" style={{ width: 6, height: 6, display: 'inline-block' }}></div>
              LIVE
            </>
          ) : (
            'UPCOMING'
          )}
        </div>
      </div>

      <div className="teams-row">
        <div className="team">
          <motion.div className="team-logo" whileHover={{ scale: 1.2, rotate: -10 }}>{match.teamA.logo}</motion.div>
          <div className="team-short">{match.teamA.short}</div>
          <div className="team-region">{match.teamA.region}</div>
        </div>

        <div className="vs-divider">
          <div className="vs-text">VS</div>
          {match.status === 'upcoming' && (
            <div className="vs-time">
              {new Date(match.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>

        <div className="team">
          <motion.div className="team-logo" whileHover={{ scale: 1.2, rotate: 10 }}>{match.teamB.logo}</motion.div>
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
            transition={{ duration: 1, ease: "easeOut" }}
          ></motion.div>
        </div>
      </div>

      <div className="card-footer">
        <div className="odds-chips">
          <motion.div className="odds-chip" whileHover={{ scale: 1.1 }}>{oddsA}x</motion.div>
          <motion.div className="odds-chip" style={{ background: 'rgba(0,217,245,0.08)', color: 'var(--neon2)', borderColor: 'rgba(0,217,245,0.2)' }} whileHover={{ scale: 1.1 }}>
            {oddsB}x
          </motion.div>
        </div>
        <div className="total-pool">Pool: <b>{totalPool} XLM</b></div>
      </div>
    </motion.div>
  );
}
