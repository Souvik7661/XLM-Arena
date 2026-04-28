import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import MatchCard from './components/MatchCard';
import BetModal from './components/BetModal';
import MyBets from './components/MyBets';
import AdminDashboard from './components/AdminDashboard';
import AnimatedBackground from './components/AnimatedBackground';
import SplashScreen from './components/SplashScreen';
import LiquidGlass from './components/LiquidGlass';
import { MATCHES, GAME_FILTERS } from './data/matches';
import { connectWallet, disconnectWallet } from './utils/walletKit';
import { fetchXLMBalance } from './utils/stellar';
import { initMarket, placeBet, getMarketState } from './utils/contractClient';

function App() {
  const [showSplash, setShowSplash] = React.useState(true);
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState('0.00');
  const [activeTab, setActiveTab] = useState('markets'); 
  const [filter, setFilter] = useState('All');
  const [liveOnly, setLiveOnly] = useState(false);
  const [search, setSearch] = useState('');
  
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
    if (search && !m.game.toLowerCase().includes(search.toLowerCase()) &&
        !m.teamA.name.toLowerCase().includes(search.toLowerCase()) &&
        !m.teamB.name.toLowerCase().includes(search.toLowerCase()) &&
        !m.tournament.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 400, damping: 20 } }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'markets':
        return (
          <AnimatePresence mode="wait">
            <motion.div key="markets" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.5 }}>
              <section className="hero" style={{ paddingTop: '6rem', paddingBottom: '3rem', position: 'relative' }}>
                <motion.div 
                  className="hero-content"
                  animate={{ y: [-8, 8, -8] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                  style={{ position: 'relative', zIndex: 2 }}
                >
                  {/* Glowing Web3 Orb behind text */}
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4], rotate: [0, 90, 0] }}
                    transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                    style={{
                      position: 'absolute', top: '50%', left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '300px', height: '300px',
                      background: 'radial-gradient(circle, rgba(16,185,129,0.25) 0%, rgba(59,130,246,0.25) 40%, transparent 70%)',
                      zIndex: -1, pointerEvents: 'none'
                    }}
                  />

                {/* Glass badge pill */}
                <motion.div
                  initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.16,1,0.3,1], delay: 0.1 }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.35rem 1rem', borderRadius: '40px',
                    background: 'rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.14)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 20px rgba(0,0,0,0.2)',
                    color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', fontWeight: 600,
                    marginBottom: '2rem', letterSpacing: '0.02em',
                  }}
                >
                  <motion.div
                    animate={{ scale: [1,1.4,1], opacity: [1,0.4,1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }}
                  />
                  Live on Stellar Testnet — Gasless Transactions Active
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 24, delay: 0.2 }}
                  style={{ position: 'relative' }}
                >
                  Predict. Win.{' '}
                  <span style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 45%, #3b82f6 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    display: 'inline-block',
                  }}>
                    On-Chain.
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 24, delay: 0.35 }}
                >
                  The ultimate decentralized Web3 gaming prediction market built on Stellar.
                  Stake XLM, back your favourite teams, and earn on-chain rewards.
                </motion.p>

                <motion.div
                  className="hero-actions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 22 }}
                >
                  <motion.button
                    className="btn btn-primary btn-lg"
                    onClick={() => document.getElementById('markets-section').scrollIntoView({ behavior: 'smooth' })}
                    whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(16,185,129,0.5)' }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Explore Markets
                  </motion.button>
                  <motion.button
                    className="btn btn-outline btn-lg"
                    onClick={() => window.open('https://stellar.expert/explorer/testnet', '_blank')}
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    style={{ backdropFilter: 'blur(16px)' }}
                  >
                    View On-Chain ↗
                  </motion.button>
                </motion.div>
                </motion.div>
              </section>

              <motion.div 
                className="stats-bar"
                initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }} transition={{ delay: 0.5, duration: 0.4 }}
                style={{ transformOrigin: 'top' }}
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
                {/* Search bar */}
                <div style={{ marginBottom: '1rem', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem', opacity: 0.4, pointerEvents: 'none' }}>🔍</span>
                  <input
                    type="text"
                    placeholder="Search games, teams, or tournaments..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                      width: '100%', padding: '0.7rem 1rem 0.7rem 2.75rem',
                      background: 'rgba(255,255,255,0.04)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '14px',
                      color: '#f8fafc',
                      fontSize: '0.9rem',
                      fontFamily: 'Inter, sans-serif',
                      outline: 'none',
                      transition: 'all 0.25s ease',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
                    }}
                    onFocus={e => { e.target.style.borderColor = 'rgba(16,185,129,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.08), inset 0 1px 0 rgba(255,255,255,0.06)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.06)'; }}
                  />
                  {search && (
                    <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%', width: '22px', height: '22px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                  )}
                </div>

                {/* Game filter chips — scrollable row */}
                <div className="filter-row" style={{ overflowX: 'auto', flexWrap: 'nowrap', paddingBottom: '0.25rem' }}>
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
        );
      case 'mybets':
        return (
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
        );
      case 'admin':
        return (
          <AnimatePresence mode="wait">
            <motion.main 
              key="admin" 
              className="main" 
              style={{ paddingTop: '3rem' }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}
            >
              <AdminDashboard matches={matches} />
            </motion.main>
          </AnimatePresence>
        );
      default:
        return null;
    }
  };

  if (showSplash) {
    return <SplashScreen onDone={() => setShowSplash(false)} />;
  }

  return (
    <div className="app">
      <Toaster position="bottom-right" toastOptions={{ 
        style: { background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)' }
      }} />
      
      <LiquidGlass />
      <AnimatedBackground />

      <Navbar 
        address={address} 
        balance={balance} 
        onConnect={handleConnect} 
        onDisconnect={handleDisconnect}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {renderTabContent()}

      <footer className="footer">
        <div>© 2026 XLM Arena on Stellar. All rights reserved.</div>
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
