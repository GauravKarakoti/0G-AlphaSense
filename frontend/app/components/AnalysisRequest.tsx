'use client';

import { useState, useEffect } from 'react';
// Import hooks and utilities from CDN to resolve dependencies in the browser environment
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { ethers } from 'ethers';
import { type Abi } from 'viem';

// Define a stricter type for contract configuration to avoid 'any'
interface ContractConfig {
  address: `0x${string}` | undefined;
  abi: Abi; // Using Viem's Abi type is more descriptive than readonly unknown[]
}

interface AnalysisRequestProps {
  contractConfig: ContractConfig;
}

export default function AnalysisRequest({ contractConfig }: AnalysisRequestProps) {
  const [tokenSymbol, setTokenSymbol] = useState('');

  const { 
    data: fee, 
    isLoading: isFeeLoading, 
    isError: isFeeError,
    error: feeError, // Capture the specific error object
    refetch: refetchFee // Function to manually refetch the fee
  } = useReadContract({
    ...contractConfig,
    functionName: 'FEE',
  });

  const { 
    data: hash, 
    writeContract, 
    isPending: isWritePending,
    error: writeError 
  } = useWriteContract();

  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed, 
    error: txError 
  } = useWaitForTransactionReceipt({ hash });

  const handleRequestAnalysis = () => {
    // Guards to ensure address and tokenSymbol are valid before proceeding
    if (!contractConfig.address) {
      console.error("Contract address is not configured.");
      return;
    }
    if (!tokenSymbol.trim()) {
      console.error('Please enter a token symbol');
      return;
    }
    
    if (typeof fee === 'bigint') {
      writeContract({
        address: contractConfig.address,
        abi: contractConfig.abi,
        functionName: 'requestAnalysis',
        value: fee,
        args: [tokenSymbol.trim().toUpperCase()]
      });
    } else {
      console.error('Could not retrieve the analysis fee. Please try again.');
    }
  };

  useEffect(() => {
    if (isConfirmed) {
      setTokenSymbol('');
    }
  }, [isConfirmed]);
  
  // New useEffect to log the detailed fee-fetching error
  useEffect(() => {
    if (isFeeError && feeError) {
      console.error("Error fetching contract fee:", feeError);
    }
  }, [isFeeError, feeError]);

  useEffect(() => {
    console.log('Fee value updated:', fee);
  }, [fee]);

  const isProcessing = isWritePending || isConfirming;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Request New Analysis</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="tokenSymbol" className="block text-sm font-medium text-gray-700">
            Token Symbol
          </label>
          <input
            type="text"
            id="tokenSymbol"
            value={tokenSymbol}
            onChange={(e) => setTokenSymbol(e.target.value)}
            placeholder="e.g., ETH, BTC, SOL"
            className="mt-1 block w-full border border-gray-300 rounded-md text-gray-900 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            disabled={isProcessing}
          />
        </div>
        
        <div className="p-3 bg-gray-50 rounded-md">
          <div className="text-sm text-gray-600 flex items-center justify-between">
            <div>
              <span>Analysis Fee: </span>
              {isFeeLoading && <span className="text-gray-500">Loading...</span>}
              {isFeeError && <span className="text-red-500 font-medium">Error fetching fee</span>}
              {typeof fee === 'bigint' && <span>{ethers.formatEther(fee)} ETH</span>}
            </div>
            {isFeeError && (
              <button 
                onClick={() => refetchFee()}
                className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md px-2 py-1"
              >
                Retry
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            This fee covers data processing and AI analysis on the 0G network.
          </p>
        </div>

        <button
          onClick={handleRequestAnalysis}
          disabled={isProcessing || !tokenSymbol.trim() || typeof fee !== 'bigint' || isFeeLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isWritePending ? 'Confirming...' : 
           isConfirming ? 'Processing...' : 
           'Request Analysis'}
        </button>

        {hash && <div className="text-xs text-gray-600 break-all pt-2"><strong>Tx Hash:</strong> {hash}</div>}
        {isConfirming && <div className="text-sm text-blue-600">Waiting for confirmation...</div>}
        {isConfirmed && <div className="text-sm text-green-600">Transaction confirmed! Your analysis is processing.</div>}
        {writeError && <div className="text-sm text-red-600 break-all"><strong>Error:</strong> {writeError.message}</div>}
        {txError && <div className="text-sm text-red-600 break-all"><strong>Transaction Error:</strong> {txError.message}</div>}
      </div>
    </div>
  );
}