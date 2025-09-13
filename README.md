# 0G-AlphaSense: On-Chain AI DeFi Analyst

0G-AlphaSense is a decentralized application built on the 0G network that provides verifiable, AI-powered market analysis for cryptocurrency traders.

## Features

-   **Real-time Analysis:** Query AI for sentiment and technical analysis on any token.
-   **Verifiable Results:** All analysis is performed on the decentralized 0G Compute network, and results are anchored on the 0G Chain for transparency.
-   **Data-Rich:** Synthesizes data from price feeds, social sentiment, and on-chain metrics.
-   **Historical Reports:** Past analyses are stored cheaply and securely on 0G Storage.

## Tech Stack

-   **Blockchain:** 0G Chain (EVM)
-   **AI Compute:** 0G Compute Network
-   **Storage:** 0G Storage
-   **Smart Contracts:** Solidity, Hardhat
-   **Frontend:** Next.js, React, Tailwind CSS, Ethers.js
-   **AI Model:** Fine-tuned Mistral-7B

## Project Structure
```text
0g-alphasense/
├── contracts/ # Smart contracts
│ └── AnalystVault.sol
├── scripts/ # Deployment and interaction scripts
├── frontend/ # Next.js application
│ ├── components/
│ ├── pages/
│ └── styles/
├── backend-listener/ # Service listening for blockchain events
└── model-training/ # Jupyter notebooks for fine-tuning the AI model
```


## Getting Started

### Prerequisites

-   Node.js (v18+)
-   npm or yarn
-   A wallet with testnet ETH on the 0G Chain (see [0G Docs](https://docs.0g.ai/) for faucet)
-   0G API Keys (for Storage and Compute)

### Installation & Deployment

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/0g-alphasense.git
    cd 0g-alphasense
    ```

2.  **Install dependencies:**
    ```bash
    # Install contract dependencies
    cd contracts
    npm install

    # Install frontend dependencies
    cd ../frontend
    npm install
    ```

3.  **Configure Environment Variables:**
    - Copy `.env.example` to `.env` in both the `contracts` and `frontend` directories.
    - Fill in your private keys, 0G RPC URLs, and API keys.

4.  **Compile and Deploy Contracts:**
    ```bash
    cd contracts
    npx hardhat compile
    npx hardhat run scripts/deploy.js --network zeroGTestnet
    ```
    Update the frontend's `.env` file with the new contract address.

5.  **Run the Frontend:**
    ```bash
    cd frontend
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the dApp.

## Usage

1.  Connect your wallet to the dApp.
2.  Ensure you're on the 0G Testnet.
3.  Enter a token symbol (e.g., ETH) in the query box.
4.  Submit the query and approve the transaction (a small fee is required).
5.  Wait ~60-90 seconds for the AI to gather data and perform analysis.
6.  View your generated report on the dashboard!

## Resources

-   [0G Official Documentation](https://docs.0g.ai/)
-   [0G Compute Quick Start](https://docs.0g.ai/0g-compute/quick-start-inference-sdk)
-   [0G Storage SDK](https://docs.0g.ai/0g-storage/quick-start-storage-sdk)

## Team

-   Gaurav Karakoti ([@GauravKara_Koti](https://x.com/GauravKara_Koti)) - [[@GauravKarakoti](https://t.me/GauravKarakoti)]
