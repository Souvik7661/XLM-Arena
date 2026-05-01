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
  const [showSplash, setShowSplash] = useState(true);
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
              <section className="hero" style={{ paddingTop: '6rem', paddingBottom: '3rem', position: 'relative', display: 'flex', alignItems: 'center', gap: '2rem' }}>
                
                <motion.div 
                  className="hero-content"
                  style={{ position: 'relative', zIndex: 2, flex: 1 }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4], rotate: [0, 90, 0] }}
                    transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                    style={{
                      position: 'absolute', top: '50%', left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '300px', height: '300px',
                      background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, rgba(239,68,68,0.15) 40%, transparent 70%)',
                      zIndex: -1, pointerEvents: 'none'
                    }}
                  />

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
                    color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600,
                    marginBottom: '2rem', letterSpacing: '0.02em', marginLeft: '1rem'
                  }}
                >
                  <motion.div
                    animate={{ scale: [1,1.4,1], opacity: [1,0.4,1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    style={{ width: 6, height: 6, borderRadius: '50%', background: '#06b6d4', boxShadow: '0 0 6px #06b6d4' }}
                  />
                  Live on Stellar Testnet — Gasless Transactions Active
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 24, delay: 0.2 }}
                  style={{ position: 'relative', fontFamily: "'Space Mono', monospace", fontWeight: 700, textTransform: 'uppercase', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}
                >
                  <span style={{ fontSize: '1.2rem', letterSpacing: '4px', color: 'var(--text)', textAlign: 'left', marginLeft: '1rem' }}>MARKETPLACE FOR</span>
                  <span style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)', lineHeight: 1, letterSpacing: '4px', textAlign: 'left', display: 'flex', alignItems: 'center' }}>
                    CR<span style={{ background: 'linear-gradient(90deg, #06b6d4, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 10px rgba(6,182,212,0.4))' }}>E</span>ATORS
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 24, delay: 0.35 }}
                  style={{ textAlign: 'left', maxWidth: '600px', marginLeft: '1rem', marginTop: '1.5rem', marginBottom: '3rem', color: 'var(--text-muted)' }}
                >
                  The prediction marketplace brings together players, creators, and crypto enthusiasts on a single platform to curate and explore top events.
                </motion.p>

                <motion.div
                  className="hero-actions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 22 }}
                  style={{ justifyContent: 'flex-start', marginLeft: '1rem' }}
                >
                  <motion.button
                    className="btn btn-primary btn-lg glass-refractive"
                    onClick={() => document.getElementById('markets-section').scrollIntoView({ behavior: 'smooth' })}
                    whileHover={{ scale: 1.04, boxShadow: 'inset 0 0 20px rgba(6,182,212,0.5), 0 0 20px rgba(6,182,212,0.5), inset 0 1px 1px rgba(255,255,255,0.6)' }}
                    whileTap={{ scale: 0.97 }}
                    style={{ padding: '0.9rem 2.5rem', borderRadius: '999px', fontSize: '1.1rem' }}
                  >
                    Explore
                  </motion.button>
                  <motion.button
                    className="btn btn-ghost btn-lg"
                    onClick={() => window.open('https://stellar.expert/explorer/testnet', '_blank')}
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    style={{ color: 'var(--text)', fontWeight: 700 }}
                  >
                    Create Event ➝
                  </motion.button>
                </motion.div>
                </motion.div>
                
                <div style={{ flex: 1, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '500px' }}>
                  <div style={{ width: '400px', height: '400px', position: 'relative' }}>
                    {/* Outer slow ring */}
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 20, ease: 'linear' }} style={{ position: 'absolute', inset: 0, border: '2px dashed rgba(6,182,212,0.5)', borderRadius: '50%' }} />
                    
                    {/* Middle red ring */}
                    <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 15, ease: 'linear' }} style={{ position: 'absolute', inset: '40px', border: '2px solid rgba(239,68,68,0.3)', borderTopColor: 'transparent', borderRadius: '50%' }} />
                    
                    {/* Inner fast ring */}
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 10, ease: 'linear' }} style={{ position: 'absolute', inset: '80px', border: '4px double rgba(6,182,212,0.4)', borderLeftColor: 'transparent', borderRightColor: 'transparent', borderRadius: '50%' }} />
                    
                    {/* Core glowing center */}
                    <div style={{ position: 'absolute', inset: '120px', background: 'rgba(6,182,212,0.05)', borderRadius: '50%', boxShadow: '0 0 40px rgba(6,182,212,0.4), inset 0 0 20px rgba(6,182,212,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                       <span style={{ color: '#06b6d4', fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '2px' }}>SYS_CORE</span>
                       <span style={{ color: '#ef4444', fontSize: '1rem', letterSpacing: '6px', marginTop: '4px' }}>ACTIVE</span>
                    </div>
                  </div>

                  <motion.div 
                    style={{ position: 'absolute', right: '0%', top: '25%', display: 'flex', flexDirection: 'column', gap: '2rem', zIndex: 3 }}
                    initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.8 }}
                  >
                    <motion.div animate={{ y: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0 }} className="glass-refractive" style={{ padding: '0.8rem 1.5rem', fontSize: '0.8rem', color: 'var(--text)' }}>
                      100% Authenticity
                    </motion.div>
                    <motion.div animate={{ y: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }} className="glass-refractive" style={{ padding: '0.8rem 1.5rem', fontSize: '0.8rem', color: 'var(--text)', alignSelf: 'flex-start', transform: 'translateX(-40px)' }}>
                      50000+ Creators
                    </motion.div>
                    <motion.div animate={{ y: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 2 }} className="glass-refractive" style={{ padding: '0.8rem 1.5rem', fontSize: '0.8rem', color: 'var(--text)', alignSelf: 'flex-end', transform: 'translateX(20px)' }}>
                      5k+ NFTs Stored
                    </motion.div>
                  </motion.div>
                </div>

              </section>

              <main className="main" id="markets-section">
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
                      color: 'var(--text)',
                      fontSize: '0.9rem',
                      fontFamily: 'Inter, sans-serif',
                      outline: 'none',
                      transition: 'all 0.25s ease',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
                    }}
                    onFocus={e => { e.target.style.borderColor = 'rgba(6,182,212,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(6,182,212,0.08), inset 0 1px 0 rgba(255,255,255,0.06)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.06)'; }}
                  />
                  {search && (
                    <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%', width: '22px', height: '22px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                  )}
                </div>

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
