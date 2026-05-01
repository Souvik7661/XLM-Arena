# XLM Arena — Architecture Document

## Overview

XLM Arena is a decentralized, Web3-native prediction market platform built on the **Stellar Testnet**. Users connect their Freighter wallets and place XLM bets on real-world match outcomes. The platform is designed as a Single Page Application (SPA) with a React + Vite frontend, a deployed Soroban smart contract for on-chain market logic, and direct Horizon API integration for transaction settlement.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                    User (Browser)                   │
│            Freighter Wallet Extension               │
└──────────────────────┬──────────────────────────────┘
                       │ Signs XDR Transactions
                       ▼
┌─────────────────────────────────────────────────────┐
│              XLM Arena Frontend (SPA)               │
│         React 18 + Vite + Framer Motion             │
│                                                     │
│  ┌───────────────┐  ┌───────────────┐               │
│  │  UI Layer     │  │  Logic Layer  │               │
│  │  (Components) │  │  (Utils/SDK)  │               │
│  └───────────────┘  └───────────────┘               │
└──────────────────────┬──────────────────────────────┘
                       │ Stellar SDK / Horizon API
          ┌────────────┼──────────────────┐
          ▼            ▼                  ▼
┌──────────────┐ ┌──────────────┐ ┌───────────────────┐
│  Horizon API │ │  Friendbot   │ │  Soroban RPC      │
│ (Testnet)    │ │  (Testnet    │ │  (Smart Contract) │
│              │ │  Faucet)     │ │                   │
└──────────────┘ └──────────────┘ └───────────────────┘
```

---

## Frontend Architecture

### Technology Stack

| Layer          | Technology                         |
|----------------|------------------------------------|
| Framework      | React 18 (SPA, no SSR)             |
| Build Tool     | Vite                               |
| Animations     | Framer Motion                      |
| Styling        | Vanilla CSS (hardware-accelerated) |
| Wallet API     | `@stellar/freighter-api`           |
| Blockchain SDK | `@stellar/stellar-sdk`             |
| Hosting        | Vercel (CDN-distributed)           |

### Component Tree

```
App.jsx (Root)
├── SplashScreen.jsx        — Animated intro/loading screen
├── Navbar.jsx              — Wallet connect, navigation
├── OnboardingBot.jsx       — "Arino" AI guide for new users
├── AnimatedBackground.jsx  — Hardware-accelerated particle bg
├── LiquidGlass.jsx         — macOS-style glassmorphism renderer
├── MatchCard.jsx           — Individual prediction market card
│   └── BettingModal.jsx    — Bet placement & confirmation UI
└── AdminPanel.jsx          — /admin route: metrics, indexer
    ├── MetricsDashboard    — DAU, Volume, Tx count
    └── TransactionIndexer  — Live Horizon ledger data feed
```

### Key Design Principles
- **Hardware-Accelerated Animations:** All motion uses CSS `transform` and `opacity` exclusively — no `top/left/width` changes — to stay on the GPU compositor thread and achieve 90 FPS on mid-range devices.
- **Graceful Degradation:** The Liquid Glass refraction engine activates only on pointer-capable (desktop) devices. On mobile/touch, it elegantly degrades to a standard frosted-glass effect.
- **Progressive Enhancement:** The app is fully functional without animations enabled; motion is layered on top as an enhancement.

---

## Smart Contract Architecture

### Contract Details
- **Contract ID:** `CCKBXDO6PIAP2ZA36HKJZJX7UU6KN5T3ET7WFDTRM2ULL6VTNXZDYRPU`
- **Language:** Rust (Soroban SDK)
- **Network:** Stellar Testnet

### Contract Responsibilities
| Function              | Description                                              |
|-----------------------|----------------------------------------------------------|
| `create_market()`     | Initializes a new prediction market with two outcomes    |
| `get_odds()`          | Computes dynamic odds based on pool ratio                |
| `resolve_market()`    | Settles the market; requires M-of-N multi-sig auth       |

### Pool Settlement Model
The current iteration uses a **hybrid model**:
1. The Soroban contract manages **market state and odds computation**.
2. Actual XLM bets are settled as **native Stellar payments** to the escrow pool address (`GDRVVMULXSZQFEAE3XWHK5BVOUEYU2E5Q65BE4AXBJ6TCHGV6734PFHV`), not locked inside the contract. This is an intentional simplification for the testnet MVP.

---

## On-Chain Transaction Flow

```
User clicks "Place Bet"
         │
         ▼
ensureAccountFunded()  ←── Friendbot funds pool address if not yet active
         │
         ▼
Build TransactionBuilder (stellar-sdk)
  - Source: User public key
  - Operation: Payment → Pool Address (amount = bet in XLM)
  - Memo: Market ID + Outcome selection
         │
         ▼
freighter-api.signTransaction(XDR)
  [User signs in Freighter popup]
         │
         ▼
Horizon API submitTransaction(signedXDR)
         │
         ▼
Transaction confirmed on Testnet ledger
         │
         ▼
UI updates with confirmed tx hash + new odds
```

---

## Security Architecture

### Multi-Signature Market Resolution
To prevent fraudulent market resolution, the `resolve_market()` function in the Soroban contract requires **M-of-N multi-signature authorization**:
- **Signer 1:** Admin Key (platform operator)
- **Signer 2:** Oracle Backend Key (independent off-chain result verifier)

Both signatures must be present for a payout to be authorized. This prevents a single compromised key from stealing pool funds.

### Fee Sponsorship (Gasless Transactions)
Users with zero XLM balance can still interact with the platform:
1. The platform backend wraps the user's signed XDR in a `FeeBumpTransaction`.
2. The platform's **treasury key** signs and pays the base fee.
3. The inner transaction (user's bet) is executed fee-free from the user's perspective.

### Input Validation
- All bet amounts are validated client-side and re-validated in the contract.
- Wallet addresses are verified via Stellar SDK's `Keypair.fromPublicKey()` before any transaction is built.
- Environment variables (`VITE_TREASURY_SECRET`) are never exposed to the client bundle.

---

## Data Flow & State Management

```
Horizon Testnet API
        │
        ▼ (polling / real-time fetch)
contractClient.js  (src/utils/)
  - fetchMarkets()     → reads Soroban contract state
  - getPoolBalance()   → reads Horizon account balance
  - indexTransactions()→ fetches raw ledger tx history
        │
        ▼
React State (useState / useEffect in App.jsx)
        │
        ▼
Props → MatchCard → BettingModal → UI
```

### No External State Library
State is managed with React's built-in `useState` and `useEffect` hooks. The app is sufficiently small that Redux/Zustand would be overkill. A context provider (`WalletContext`) manages global wallet connection state.

---

## CI/CD Pipeline

```
GitHub Push → main branch
        │
        ▼
GitHub Actions (.github/workflows/main.yml)
  - Install dependencies (npm ci)
  - Lint check (ESLint)
  - Build validation (npm run build)
        │
        ▼ (on success)
Vercel Auto-Deploy (Git integration)
  - Preview deployments on PRs
  - Production deploy on main merge
```

- **Live URL:** [https://play-chain-plum.vercel.app](https://play-chain-plum.vercel.app)
- **CI Badge:** [![CI/CD Pipeline](https://github.com/Souvik7661/XLM-Arena/actions/workflows/main.yml/badge.svg)](https://github.com/Souvik7661/XLM-Arena/actions)

---

## Monitoring & Observability

| Tool              | Purpose                                              |
|-------------------|------------------------------------------------------|
| Sentry            | Runtime error tracking, crash reporting              |
| Admin Panel `/admin` | Custom DAU, volume, and Tx metrics dashboard      |
| Horizon Indexer   | Real-time ledger transaction feed for pool address   |

---

## Directory Structure

```
XLM-Arena/
├── contracts/              # Rust Soroban smart contract
│   └── src/lib.rs
├── src/
│   ├── components/         # React UI components
│   │   ├── SplashScreen.jsx
│   │   ├── Navbar.jsx
│   │   ├── OnboardingBot.jsx
│   │   ├── MatchCard.jsx
│   │   ├── LiquidGlass.jsx
│   │   └── AnimatedBackground.jsx
│   ├── utils/              # Blockchain & helper utilities
│   │   ├── contractClient.js  # Soroban + Horizon interaction
│   │   └── stellar.js         # Transaction builders
│   ├── data/               # Static match/market data
│   ├── App.jsx             # Root component & routing
│   ├── main.jsx            # React entry point
│   └── index.css           # Global design system & animations
├── public/                 # Static assets
├── .github/workflows/      # CI/CD pipeline definitions
├── ARCHITECTURE.md         # This document
├── README.md               # Project overview & submission docs
└── SECURITY.md             # Security audit checklist
```

---

## Future Architecture Plans (Phase 2)

Based on user feedback collected during the Blue Belt phase, the following architectural improvements are planned:

1. **Full Soroban Escrow:** Migrate pool funds fully into the Soroban contract to eliminate the hybrid settlement model. All XLM will be locked and released by the contract, not manual payments.
2. **WebSocket Real-Time Updates:** Replace polling with Stellar Horizon's streaming API (`EventSource`) for instant, push-based odds updates without page refresh.
3. **Off-Chain Oracle Integration:** Integrate a decentralized sports data oracle (e.g., Band Protocol or a custom signed-result backend) to automate market resolution without manual admin intervention.
4. **IPFS-Based Match Data:** Store match metadata on IPFS and reference it from the Soroban contract to make the platform fully censorship-resistant.