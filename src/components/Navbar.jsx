import React from 'react';
import { Wallet, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar({ address, balance, onConnect, onDisconnect, activeTab, setActiveTab }) {
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 5)}...${addr.slice(-4)}`;
  };

  const appleEase = [0.16, 1, 0.3, 1];

  return (
    <motion.nav 
      className="navbar"
      initial={{ y: -30, opacity: 0, filter: 'blur(4px)' }}
      animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 1, ease: appleEase }}
    >
      <div className="navbar-logo">
        <motion.span 
          className="navbar-logo-icon"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <img src="/favicon.svg" alt="PlayChain Logo" style={{ width: '28px', height: '28px' }} />
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
            whileHover={{ scale: 1.02, transition: { duration: 0.3, ease: appleEase } }}
            whileTap={{ scale: 0.98 }}
          >
            <Wallet size={16} />
            Connect Wallet
          </motion.button>
        ) : (
          <>
            <motion.div 
              className="wallet-chip"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: appleEase }}
            >
              <div className="wallet-dot"></div>
              {balance} XLM
            </motion.div>
            <motion.div 
              className="wallet-chip" 
              style={{ background: 'transparent', border: '1px solid var(--border)' }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: appleEase }}
            >
              {formatAddress(address)}
            </motion.div>
            <motion.button 
              className="btn btn-ghost" 
              onClick={onDisconnect} 
              style={{ padding: '0.4rem', borderRadius: '50%' }} 
              title="Disconnect"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: appleEase }}
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--red)', transition: { duration: 0.3, ease: appleEase } }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut size={16} />
            </motion.button>
          </>
        )}
      </div>
    </motion.nav>
  );
}
