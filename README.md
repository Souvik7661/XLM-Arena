# PlayChain

PlayChain is a sophisticated, decentralized Web3 gaming prediction market built on the Stellar Testnet. It features a beautifully animated, minimalistic interface (inspired by Apple design principles) and robust integration with the Freighter wallet.

## Features
- **Stellar Native Integration**: Connects to Freighter and signs native XDR transactions via `@stellar/freighter-api`.
- **Sophisticated Animations**: Uses Framer Motion for incredibly smooth, high-end bezier curve transitions.
- **Dynamic Odds Computation**: Mocks a Soroban smart contract client to dynamically calculate odds based on pool size.

## Blue Belt Submission Requirements

This repository has been configured to meet the Stellar Blue Belt competition criteria:

1. **Testnet MVP Completion**: The project is fully functional on the Stellar Testnet. Users can connect their Freighter wallet, view live odds, and sign transactions.
2. **User Validation Strategy**: The next step is to conduct usability testing with real users.
   - **Goal**: Collect feedback from at least 5 individual users testing the MVP on the Stellar Testnet.
   - **Metrics Tracked**: Wallet connection success rate, UX friction during betting, and overall design feedback.
   - **Feedback Loop**: We will iterate on the frontend logic based on user friction points prior to Mainnet deployment.
3. **Architecture Documentation**: The workflow of Freighter wallet injection and smart contract polling is fully documented within the source components (`walletKit.js` and `contractClient.js`).

## Getting Started

1. Install dependencies: `npm install`
2. Start the local dev server: `npm run dev`
3. Ensure you have the **Freighter Wallet Extension** installed on your browser and set to **Testnet**.

## License
MIT
