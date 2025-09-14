const { ethers } = require('ethers');
const { fetchMarketData } = require('./dataFetcher');
const { generateAnalysis } = require('./aiService');
const { storeAnalysis } = require('./storageService');
require('dotenv').config();

// Configure 0G provider
const PROVIDER_URL = process.env.ZEROG_PROVIDER_URL || 'https://evmrpc-testnet.0g.ai';
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
// This private key must belong to the account that deployed the contract (the owner).
const PRIVATE_KEY = process.env.OWNER_PRIVATE_KEY; 

const ABI = [
  "event AnalysisRequested(uint256 indexed requestId, address indexed user, string tokenSymbol)",
  "function submitAnalysis(uint256 requestId, string calldata ipfsHash) external"
];

let provider;
let wallet;
let contract;

const initBlockchain = async () => {
  try {
    provider = new ethers.JsonRpcProvider(PROVIDER_URL);
    wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);
    
    // The oracle check is removed. The wallet now needs to be the owner.
    console.log(`Blockchain initialized. Using owner address: ${wallet.address}`);
  } catch (error) {
    console.error('Failed to initialize blockchain:', error);
    process.exit(1);
  }
};

const startEventListener = async () => {
  await initBlockchain();
  
  // Listen for AnalysisRequested events
  contract.on('AnalysisRequested', async (requestId, user, tokenSymbol, event) => {
    console.log(`New analysis requested: ID=${requestId}, Token=${tokenSymbol}, User=${user}`);
    
    try {
      // Fetch market data
      const marketData = await fetchMarketData(tokenSymbol);
      
      // Generate AI analysis
      const analysisText = await generateAnalysis(tokenSymbol, marketData);
      
      // Store analysis on 0G Storage
      const ipfsHash = await storeAnalysis({
        requestId: requestId.toString(),
        tokenSymbol,
        user,
        analysis: analysisText,
        timestamp: new Date().toISOString()
      });
      
      // Submit result to blockchain
      console.log(`Submitting analysis for request ${requestId} with owner account...`);
      const tx = await contract.submitAnalysis(requestId, ipfsHash);
      await tx.wait();
      
      console.log(`Analysis completed for request ${requestId}. TX: ${tx.hash}`);
    } catch (error) {
      console.error(`Error processing request ${requestId}:`, error);
    }
  });
  
  console.log('Listening for AnalysisRequested events...');
};

module.exports = { startEventListener };