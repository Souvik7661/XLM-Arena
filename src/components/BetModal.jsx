import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { computeOdds } from '../utils/contractClient';
import { motion } from 'framer-motion';

export default function BetModal({ match, onClose, onPlaceBet, address, balance }) {
  const [selectedTeam, setSelectedTeam] = useState(null); 
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!match) return null;

  const oddsA = computeOdds(match, 'A');
  const oddsB = computeOdds(match, 'B');

  const currentOdds = selectedTeam === 'A' ? oddsA : selectedTeam === 'B' ? oddsB : 0;
  const potentialReturn = amount && selectedTeam ? (parseFloat(amount) * currentOdds).toFixed(2) : '0.00';

  const handleBet = async () => {
    if (!selectedTeam || !amount || parseFloat(amount) <= 0) return;
    if (parseFloat(amount) > parseFloat(balance)) {
      alert('Insufficient balance');
      return;
    }
    setLoading(true);
    try {
      await onPlaceBet({ matchId: match.id, team: selectedTeam, amount: parseFloat(amount) });
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to place bet: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const appleEase = [0.16, 1, 0.3, 1];

  return (
    <motion.div 
      className="modal-overlay" 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
      exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      transition={{ duration: 0.6, ease: appleEase }}
    >
      <motion.div 
        className="modal"
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ duration: 0.7, ease: appleEase }}
      >
        <div className="modal-header">
          <h2 className="modal-title">Place Prediction</h2>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="team-select">
          <motion.div 
            className={`team-option ${selectedTeam === 'A' ? 'selected' : ''}`}
            onClick={() => setSelectedTeam('A')}
            whileHover={{ scale: 1.02, transition: { duration: 0.3, ease: appleEase } }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="team-option-logo">{match.teamA.logo}</div>
            <div className="team-option-name">{match.teamA.short}</div>
            <div className="team-option-odds">{oddsA}x Return</div>
          </motion.div>
          
          <motion.div 
            className={`team-option ${selectedTeam === 'B' ? 'selected' : ''}`}
            style={selectedTeam === 'B' ? { borderColor: 'var(--neon2)', background: 'rgba(0,217,245,0.1)' } : {}}
            onClick={() => setSelectedTeam('B')}
            whileHover={{ scale: 1.02, transition: { duration: 0.3, ease: appleEase } }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="team-option-logo">{match.teamB.logo}</div>
            <div className="team-option-name">{match.teamB.short}</div>
            <div className="team-option-odds" style={{ color: 'var(--neon2)' }}>{oddsB}x Return</div>
          </motion.div>
        </div>

        <div className="amount-section">
          <div className="amount-label">Stake Amount</div>
          <div className="amount-input-wrap">
            <input 
              type="number" 
              className="amount-input" 
              placeholder="0.00" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="1"
            />
            <span className="amount-suffix">XLM</span>
          </div>
          <div className="quick-amounts">
            {[10, 50, 100, 'Max'].map(val => (
              <motion.button 
                key={val} 
                className="quick-btn"
                onClick={() => setAmount(val === 'Max' ? Math.floor(parseFloat(balance) - 1).toString() : val.toString())}
                whileHover={{ scale: 1.05, transition: { duration: 0.3, ease: appleEase } }}
                whileTap={{ scale: 0.95 }}
              >
                {val === 'Max' ? 'MAX' : `+${val}`}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="payout-preview">
          <div className="payout-row">
            <span className="payout-key">Est. Odds</span>
            <span className="payout-val">{selectedTeam ? `${currentOdds}x` : '-'}</span>
          </div>
          <div className="payout-row">
            <span className="payout-key">Network Fee</span>
            <span className="payout-val">~0.00001 XLM</span>
          </div>
          <div className="payout-row" style={{ marginTop: '0.8rem', paddingTop: '0.8rem', borderTop: '1px solid rgba(0,245,160,0.2)' }}>
            <span className="payout-key">Potential Return</span>
            <span className="payout-val highlight">{potentialReturn} XLM</span>
          </div>
        </div>

        <motion.button 
          className="btn btn-primary btn-lg" 
          style={{ width: '100%', justifyContent: 'center' }}
          disabled={!selectedTeam || !amount || parseFloat(amount) <= 0 || loading || !address}
          onClick={handleBet}
          whileHover={{ scale: 1.02, transition: { duration: 0.3, ease: appleEase } }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? 'Confirming in Wallet...' : !address ? 'Connect Wallet to Bet' : 'Place Prediction'}
        </motion.button>
        
        {!address && (
          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            You need to connect your Freighter wallet to interact with the Stellar network.
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
