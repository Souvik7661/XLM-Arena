import React from 'react';
import { Wallet, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar({ address, balance, onConnect, onDisconnect, activeTab, setActiveTab }) {
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 5)}...${addr.slice(-4)}`;
  };

  return (
    <motion.nav 
      className="navbar"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="navbar-logo">
        <motion.span 
          className="navbar-logo-icon"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          🎮
        </motion.span>
        <span>
          Play<span className="grad" style={{ background: 'linear-gradient(135deg, var(--neon), var(--neon2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Chain</span>
        </span>
      </div>

      {address && (
        <div className="navbar-nav">
          <button 
            className={`nav-btn ${activeTab === 'markets' ? 'active' : ''}`}
            onClick={() => setActiveTab('markets')}
          >
            Markets
          </button>
          <button 
            className={`nav-btn ${activeTab === 'mybets' ? 'active' : ''}`}
            onClick={() => setActiveTab('mybets')}
          >
            My Bets
          </button>
        </div>
      )}

      <div className="navbar-actions">
        {!address ? (
          <motion.button 
            className="btn btn-primary" 
            onClick={onConnect}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Wallet size={16} />
            Connect Wallet
          </motion.button>
        ) : (
          <>
            <motion.div 
              className="wallet-chip"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="wallet-dot"></div>
              {balance} XLM
            </motion.div>
            <div className="wallet-chip" style={{ background: 'transparent', border: '1px solid var(--border)' }}>
              {formatAddress(address)}
            </div>
            <motion.button 
              className="btn btn-ghost" 
              onClick={onDisconnect} 
              style={{ padding: '0.4rem', borderRadius: '50%' }} 
              title="Disconnect"
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--red)' }}
              whileTap={{ scale: 0.9 }}
            >
              <LogOut size={16} />
            </motion.button>
          </>
        )}
      </div>
    </motion.nav>
  );
}
