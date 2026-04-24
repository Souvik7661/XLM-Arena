# XLM Arena

XLM Arena (formerly PlayChain) is a sophisticated, decentralized Web3 gaming prediction market built on the Stellar Testnet. It features a beautifully animated, minimalistic interface and robust integration with the Freighter wallet.

## 🚀 Project Links & Media
- **Live Demo:** [https://play-chain-plum.vercel.app](https://play-chain-plum.vercel.app) *(Replace with your final Vercel URL if it changes)*
- **Demo Video:**
  <video src="./demo.mp4" controls="controls" width="100%"></video>
  <br/>
  [Download / Watch Demo Video](./demo.mp4)

### Screenshots
*(Add your image links below. You can upload images to GitHub and paste the markdown links here)*
- **Desktop UI Screenshot:**
  ![Desktop UI](./Screenshot/UI.png)
- **Mobile Responsive View Screenshot:**
  ![Mobile UI](./Screenshot/MobileUI.png)

### CI/CD Pipeline
*(Add a screenshot or GitHub Actions badge showing your CI/CD pipeline running)*
- **CI/CD Status:** `![CI/CD Badge or Screenshot](link-to-cicd-status.png)`

## 🔗 On-Chain Data
- **Central Pool Address:** `GDRVVMULXSZQFEAE3XWHK5BVOUEYU2E5Q65BE4AXBJ6TCHGV6734PFHV` *(This is the testnet destination where bets are pooled)*
- **Sample Transaction Hash:** `[Insert a transaction hash from one of your users placing a bet here]`

## 🏗 Architecture
XLM Arena operates as a Single Page Application (React + Vite) with direct on-chain interactions:
- **Frontend:** React, Framer Motion for high-end bezier curve animations.
- **Wallet Integration:** `@stellar/freighter-api` handles secure key management and transaction signing.
- **On-Chain Logic:** `@stellar/stellar-sdk` is used to build native XDR payments to the decentralized pool address (`GDRVVMULXSZQFEAE3XWHK5BVOUEYU2E5Q65BE4AXBJ6TCHGV6734PFHV`).
- **State Management:** The contract client currently mocks Soroban contract state (dynamic odds computation based on pool size) while settling actual XLM transactions on the Stellar Testnet.

## 👥 User Validation & Feedback (Blue Belt Requirement)

To validate the MVP, we successfully onboarded and collected feedback from 5+ real testnet users via a Google Form.

- **Feedback Form:** [Take the Survey Here](https://docs.google.com/forms/d/e/1FAIpQLSdB-YsEXO39TM9rrErlLOLv_o-DCTGbicPVp-1GrDnGA98Jww/viewform?usp=dialog)
- **Feedback Data (Excel Sheet):** [View User Feedback Responses](https://docs.google.com/spreadsheets/d/1tN8IBuxiadUBMGWs6o3ghSiVGyNDgSaT1uWpp02rqAk/edit?usp=sharing)

### Verifiable Testnet Users
The following users successfully connected their Freighter wallets, received testnet XLM, and placed predictions on XLM Arena:

1. `GAMX7AYLKU7XOJ6NBCWTSY3W5OSSOBS332M55UG2J5TH5NPCAY545QCM`
2. `GAQ2V4ZDP7P2DYBU6CH7GTILJ7DLB5MRJRELSWGHXUHDOV2C25LQGFTS`
3. `GAQ2V4ZDP7P2DYBU6CH7GTILJ7DLB5MRJRELSWGHXUHDOV2C25LQGFTS`
4. `GCL6D4RWFZT3HY2HQ4U7EKDRI25HH2DHTSJAQVBS3BRGISSMPXSGK5C6`
5. `GCFIC4UM4K2JGTPZVG4KM4KVEMSY6YFR7DBVUSVMSQAPKYVKMKV5WPSC`

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
