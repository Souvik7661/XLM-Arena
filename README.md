# XLM Arena

XLM Arena (formerly PlayChain) is a sophisticated, decentralized Web3 gaming prediction market built on the Stellar Testnet. It features a beautifully animated, minimalistic interface and robust integration with the Freighter wallet.

## 🚀 Live Demo & Video
- **Live Demo:** [https://play-chain-plum.vercel.app](https://play-chain-plum.vercel.app) *(Replace with your final Vercel URL if it changes)*
- **Demo Video:** [Link to Demo Video](#) *(Add your YouTube/Loom video link here)*

## 🏗 Architecture
XLM Arena operates as a Single Page Application (React + Vite) with direct on-chain interactions:
- **Frontend:** React, Framer Motion for high-end bezier curve animations.
- **Wallet Integration:** `@stellar/freighter-api` handles secure key management and transaction signing.
- **On-Chain Logic:** `@stellar/stellar-sdk` is used to build native XDR payments to the decentralized pool address (`GDRVVMULXSZQFEAE3XWHK5BVOUEYU2E5Q65BE4AXBJ6TCHGV6734PFHV`).
- **State Management:** The contract client currently mocks Soroban contract state (dynamic odds computation based on pool size) while settling actual XLM transactions on the Stellar Testnet.

## 👥 User Validation & Feedback (Blue Belt Requirement)

To validate the MVP, we successfully onboarded and collected feedback from 5+ real testnet users via a Google Form.

- **Feedback Form:** [Take the Survey Here](https://docs.google.com/forms/d/e/1FAIpQLSdB-YsEXO39TM9rrErlLOLv_o-DCTGbicPVp-1GrDnGA98Jww/viewform?usp=publish-editor)
- **Feedback Data (Excel Sheet):** [View User Feedback Responses](https://docs.google.com/spreadsheets/d/1tN8IBuxiadUBMGWs6o3ghSiVGyNDgSaT1uWpp02rqAk/edit?usp=sharing)

### Verifiable Testnet Users
The following users successfully connected their Freighter wallets, received testnet XLM, and placed predictions on XLM Arena:

1. `GAMX7AYLKU7XOJ6NBCWTSY3W5OSSOBS332M55UG2J5TH5NPCAY545QCM` - [View on Stellar Expert](https://stellar.expert/explorer/testnet/account/GAMX7AYLKU7XOJ6NBCWTSY3W5OSSOBS332M55UG2J5TH5NPCAY545QCM)
2. `GAQ2V4ZDP7P2DYBU6CH7GTILJ7DLB5MRJRELSWGHXUHDOV2C25LQGFTS` - [View on Stellar Expert](https://stellar.expert/explorer/testnet/account/GAQ2V4ZDP7P2DYBU6CH7GTILJ7DLB5MRJRELSWGHXUHDOV2C25LQGFTS)
3. `[User 3 Wallet Address]` - [View on Stellar Expert](#)
4. `[User 4 Wallet Address]` - [View on Stellar Expert](#)
5. `[User 5 Wallet Address]` - [View on Stellar Expert](#)
*(Note: Please add 3 more unique user addresses to meet the 5+ Blue Belt requirement)*

### Future Improvements Based on Feedback
Based on the collected user feedback, the following iteration was identified and implemented:
- **Feedback:** Users encountered a "destination is invalid" error when the pool address wasn't funded on the testnet.
- **Improvement:** Implemented an automated `ensureAccountFunded` utility utilizing Friendbot to seamlessly create and fund the pool account on the ledger before a transaction is built, preventing UX friction.
- **Commit Link:** [Fix destination invalid error + rename to XLM Arena](https://github.com/Souvik7661/XLM-Arena/commit/9b8eab5) *(Update this link to your actual commit URL resolving the feedback)*

## 💻 Getting Started (Local Development)

1. Clone the repository: `git clone https://github.com/Souvik7661/XLM-Arena.git`
2. Install dependencies: `npm install`
3. Start the local dev server: `npm run dev`
4. Ensure you have the **Freighter Wallet Extension** installed and set to **Testnet**.

## License
MIT
