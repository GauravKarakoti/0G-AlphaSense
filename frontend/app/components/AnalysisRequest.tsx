'use client';

import { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { ethers } from 'ethers';

interface AnalysisRequestProps {
  contractConfig: {
    address: `0x${string}` | undefined;
    abi: any[];
  };
}

export default function AnalysisRequest({ contractConfig }: AnalysisRequestProps) {
  const [tokenSymbol, setTokenSymbol] = useState('');

  const { data: fee } = useReadContract({
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
    if (!contractConfig.address) {
      alert("Contract address is not configured.");
      return;
    }
    if (!tokenSymbol.trim()) {
      alert('Please enter a token symbol');
      return;
    }
    if (typeof fee !== 'bigint') {
      alert('Could not retrieve the analysis fee. Please try again.');
      return;
    }
    
    writeContract({
      ...contractConfig,
      address: contractConfig.address,
      functionName: 'requestAnalysis',
      value: fee,
      args: [tokenSymbol.trim().toUpperCase()]
    });
  };

  useEffect(() => {
    if (isConfirmed) {
      setTokenSymbol('');
    }
  }, [isConfirmed]);

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
          <p className="text-sm text-gray-600">
            Analysis Fee: {typeof fee === 'bigint' ? ethers.formatEther(fee) : '...'} ETH
          </p>
          <p className="text-xs text-gray-500 mt-1">
            This fee covers data processing and AI analysis on the 0G network.
          </p>
        </div>

        <button
          onClick={handleRequestAnalysis}
          disabled={isProcessing || !tokenSymbol.trim() || typeof fee !== 'bigint'}
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