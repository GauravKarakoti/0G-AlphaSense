'use client';

import { useAccount } from 'wagmi';
import WalletConnector from './components/WalletConnector';
import AnalysisRequest from './components/AnalysisRequest';
import AnalysisHistory from './components/AnalysisHistory';

// --- Main Page Component ---
export default function Home() {
  const { address, isConnected } = useAccount();
  
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}` | undefined;

  const contractConfig = {
    address: contractAddress,
    abi: [
      {
        "inputs": [{"internalType": "string","name": "_tokenSymbol","type": "string"}],
        "name": "requestAnalysis",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [{"internalType": "uint256","name": "_requestId","type": "uint256"}],
        "name": "getAnalysis",
        "outputs": [{"internalType": "string","name": "","type": "string"}],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [{"internalType": "uint256","name": "","type": "uint256"}],
        "name": "requestFulfilled",
        "outputs": [{"internalType": "bool","name": "","type": "bool"}],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "FEE",
        "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
      }
    ]
  };
  
  if (!contractAddress) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="p-8 bg-white shadow-lg rounded-md text-center">
                <h2 className="text-xl font-bold text-red-600">Configuration Error</h2>
                <p className="text-gray-700 mt-2">The smart contract address is not configured. Please set NEXT_PUBLIC_CONTRACT_ADDRESS in your environment variables.</p>
            </div>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">0G-AlphaSense</h1>
          <WalletConnector />
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {isConnected && address ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <AnalysisRequest contractConfig={contractConfig} />
            </div>
            
            <div className="lg:col-span-2">
              <AnalysisHistory address={address} contractConfig={contractConfig} />
            </div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <h2 className="text-2xl font-medium text-gray-900 mb-4">Welcome to 0G-AlphaSense</h2>
            <p className="text-gray-600 mb-6">Connect your wallet to get started with AI-powered market analysis.</p>
            <WalletConnector />
          </div>
        )}
      </main>
    </div>
  );
}