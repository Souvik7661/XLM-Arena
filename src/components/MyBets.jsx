import React from 'react';
import { computePayout } from '../utils/contractClient';

export default function MyBets({ bets, matches, address }) {
  if (bets.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🎟️</div>
        <h3>No predictions yet</h3>
        <p>Explore markets and place your first prediction on an upcoming match.</p>
      </div>
    );
  }

  return (
    <div className="bets-panel">
      <div className="section-header">
        <h2 className="section-title">My Predictions</h2>
        <span className="section-count">{bets.length} Active</span>
      </div>

      <div className="bet-list">
        {bets.map((bet, i) => {
          const match = matches.find(m => m.id === bet.matchId);
          if (!match) return null;

          const teamData = bet.team === 'A' ? match.teamA : match.teamB;
          const isResolved = match.resolved;
          const isWinner = isResolved && match.winner === bet.team;
          
          let payout = 0;
          if (isResolved && isWinner) {
            payout = computePayout(match, address);
          }

          return (
            <div key={i} className="bet-item">
              <div style={{ flex: 1 }}>
                <div className="bet-match">
                  {match.teamA.short} vs {match.teamB.short}
                </div>
                <div className="bet-detail">
                  Prediction: <b style={{ color: bet.team === 'A' ? 'var(--neon)' : 'var(--neon2)' }}>{teamData.name}</b>
                </div>
                <div style={{ marginTop: '0.4rem' }}>
                  <a 
                    href={`https://stellar.expert/explorer/testnet/tx/${bet.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="tx-link"
                  >
                    View TX ↗
                  </a>
                </div>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div className="bet-amount">{bet.amount} XLM</div>
                <div style={{ marginTop: '0.4rem' }}>
                  {!isResolved ? (
                    <span className="bet-status bet-pending">Pending</span>
                  ) : isWinner ? (
                    <span className="bet-status bet-won">Won +{payout} XLM</span>
                  ) : (
                    <span className="bet-status bet-lost">Lost</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
