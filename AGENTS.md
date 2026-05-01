# AGENTS.md

## Commands
- `npm run dev` - Start Vite dev server
- `npm run build` - Production build
- `npm run preview` - Preview build

## Setup
- Requires **Freighter Wallet Extension** installed and set to **Testnet**
- Copy `.env.example` to `.env` if needed

## Architecture
- Single React + Vite app (not monorepo)
- Entry: `src/main.jsx` → `src/App.jsx`
- Components: `src/components/`
- Stellar utilities: `src/utils/walletKit.js`, `src/utils/stellar.js`
- Mock contract client: `src/utils/contractClient.js`

## Testing
- No test suite configured (no Jest/Vitest in package.json)

## Build Notes
- `vite.config.js` defines `global: 'globalThis'` for Stellar SDK compatibility