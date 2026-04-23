import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import MatchCard from './components/MatchCard';
import BetModal from './components/BetModal';
import MyBets from './components/MyBets';
import AnimatedBackground from './components/AnimatedBackground';
import { MATCHES, GAME_FILTERS } from './data/matches';
import { connectWallet, disconnectWallet } from './utils/walletKit';
import { fetchXLMBalance } from './utils/stellar';
import { initMarket, placeBet, getMarketState } from './utils/contractClient';

function App() {
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState('0.00');
  const [activeTab, setActiveTab] = useState('markets'); 
  const [filter, setFilter] = useState('All');
  const [liveOnly, setLiveOnly] = useState(false);
  
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [myBetsList, setMyBetsList] = useState([]);

  useEffect(() => {
    const initialisedMatches = MATCHES.map(m => {
      initMarket(m.id, 'A', 'B', (m.poolA + m.poolB) / 2); 
      const state = getMarketState(m.id);
      return { ...m, poolA: state.poolA, poolB: state.poolB, resolved: state.resolved, winner: state.winner, bets: state.bets };
    });
    setMatches(initialisedMatches);
  }, []);

  const handleConnect = async () => {
    try {
      const pubKey = await connectWallet();
      setAddress(pubKey);
      toast.success('Wallet connected!');
      const bal = await fetchXLMBalance(pubKey);
      setBalance(bal);
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to connect wallet');
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setAddress(null);
    setBalance('0.00');
    toast.success('Wallet disconnected');
  };

  const handlePlaceBet = async ({ matchId, team, amount }) => {
    try {
      const result = await placeBet({ matchId, team, amount, address });
      toast.success(
        <div>
          Prediction placed successfully!<br/>
          <a href={`https://stellar.expert/explorer/testnet/tx/${result.txHash}`} target="_blank" rel="noreferrer" style={{color: 'var(--neon)', textDecoration: 'underline', fontSize: '0.8rem'}}>View on Stellar Expert</a>
        </div>
      );
      
      const state = getMarketState(matchId);
      setMatches(prev => prev.map(m => m.id === matchId ? { ...m, poolA: state.poolA, poolB: state.poolB, bets: state.bets } : m));
      setMyBetsList(prev => [{ matchId, team, amount, txHash: result.txHash, timestamp: Date.now() }, ...prev]);
      
      const newBal = await fetchXLMBalance(address);
      setBalance(newBal);
    } catch (err) {
      throw err;
    }
  };

  const filteredMatches = matches.filter(m => {
    if (filter !== 'All' && m.game !== filter) return false;
    if (liveOnly && m.status !== 'live') return false;
    return true;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="app">
      <Toaster position="bottom-right" toastOptions={{ 
        style: { background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)' }
      }} />
      
      <AnimatedBackground />

      <Navbar 
        address={address} 
        balance={balance} 
        onConnect={handleConnect} 
        onDisconnect={handleDisconnect}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === 'markets' ? (
        <AnimatePresence mode="wait">
          <motion.div key="markets" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.4 }}>
            <section className="hero">
              <motion.div 
                className="hero-badge"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
              >
                Stellar Testnet MVP
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
              >
                Predict. Win. <span className="grad">On-Chain.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }}
              >
                The ultimate decentralized web3 gaming prediction market built on Stellar. 
                Support your favorite teams and earn XLM rewards effortlessly.
              </motion.p>
              <motion.div 
                className="hero-actions"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
              >
                <motion.button 
                  className="btn btn-primary btn-lg" 
                  onClick={() => document.getElementById('markets-section').scrollIntoView()}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                >
                  Explore Markets
                </motion.button>
                <motion.a 
                  href="https://github.com" target="_blank" rel="noreferrer" className="btn btn-ghost btn-lg"
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                >
                  View Smart Contract
                </motion.a>
              </motion.div>
            </section>

            <motion.div 
              className="stats-bar"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
            >
              <div className="stat-item">
                <div className="stat-value">6</div>
                <div className="stat-label">Active Markets</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{matches.reduce((sum, m) => sum + m.poolA + m.poolB, 0).toLocaleString()} XLM</div>
                <div className="stat-label">Total TVL</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{'< 0.01 XLM'}</div>
                <div className="stat-label">Avg. Fee</div>
              </div>
            </motion.div>

            <main className="main" id="markets-section">
              <div className="filter-row">
                {GAME_FILTERS.map(f => (
                  <motion.button 
                    key={f} 
                    className={`filter-chip ${filter === f ? 'active' : ''}`}
                    onClick={() => setFilter(f)}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  >
                    {f}
                  </motion.button>
                ))}
                <motion.button 
                  className={`filter-live ${liveOnly ? 'active' : ''}`}
                  onClick={() => setLiveOnly(!liveOnly)}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                >
                  {liveOnly && <div className="live-dot"></div>}
                  LIVE MATCHES
                </motion.button>
              </div>

              <div className="section-header">
                <h2 className="section-title">Upcoming & Live Events</h2>
                <span className="section-count">{filteredMatches.length} Matches</span>
              </div>

              {filteredMatches.length > 0 ? (
                <motion.div 
                  className="match-grid"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                >
                  <AnimatePresence>
                    {filteredMatches.map(match => (
                      <motion.div key={match.id} variants={itemVariants} layout initial="hidden" animate="show" exit={{ opacity: 0, scale: 0.9 }}>
                        <MatchCard match={match} onSelect={setSelectedMatch} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div className="empty-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="empty-state-icon">🔍</div>
                  <h3>No matches found</h3>
                  <p>Try adjusting your filters to see more events.</p>
                </motion.div>
              )}
            </main>
          </motion.div>
        </AnimatePresence>
      ) : (
        <AnimatePresence mode="wait">
          <motion.main 
            key="mybets" 
            className="main" 
            style={{ paddingTop: '3rem' }}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }}
          >
            <MyBets bets={myBetsList} matches={matches} address={address} />
          </motion.main>
        </AnimatePresence>
      )}

      <footer className="footer">
        <div>© 2026 PlayChain on Stellar. All rights reserved.</div>
        <div>
          <a href="#">Terms of Service</a> | <a href="#">Soroban Docs</a>
        </div>
      </footer>

      <AnimatePresence>
        {selectedMatch && (
          <BetModal 
            match={selectedMatch} 
            onClose={() => setSelectedMatch(null)} 
            onPlaceBet={handlePlaceBet}
            address={address}
            balance={balance}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
