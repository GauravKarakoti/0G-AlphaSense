'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { type Abi } from 'viem';

// Define a stricter type for contract configuration
interface ContractConfig {
  address: `0x${string}` | undefined;
  abi: Abi;
}

// Define the structure of an analysis request
interface AnalysisRequest {
  id: number;
  token: string;
  status: 'completed' | 'processing' | 'failed';
  date: Date;
  cid?: string; // Content ID for 0G Storage / IPFS
}

// Define the structure for a full analysis report
interface AnalysisReportData {
    analysis: string;
    tokenSymbol: string;
}

// Updated props to include contractConfig
interface AnalysisHistoryProps {
  address: `0x${string}` | undefined;
  contractConfig: ContractConfig;
}

export default function AnalysisHistory({ address, contractConfig }: AnalysisHistoryProps) {
  const [userRequests, setUserRequests] = useState<AnalysisRequest[]>([]);
  const [selectedReport, setSelectedReport] = useState<AnalysisReportData | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);

  // This effect would ideally listen for contract events or query an indexer
  // using the contractConfig prop to get a real-time list of the user's requests.
  useEffect(() => {
    if (!address) return;
    
    // Using mock data for demonstration purposes
    const mockRequests: AnalysisRequest[] = [
      { id: 1, token: 'ETH', status: 'completed', date: new Date('2025-09-13T10:00:00Z'), cid: 'QmZp9e3p2bY4w8f5j6c7d8e9f0a1b2c3d4e5f6g7h8' },
      { id: 2, token: 'BTC', status: 'processing', date: new Date('2025-09-14T11:30:00Z') },
      { id: 3, token: 'SOL', status: 'failed', date: new Date('2025-09-12T14:00:00Z') },
    ];
    setUserRequests(mockRequests);
  }, [address]);

  const handleViewReport = async (request: AnalysisRequest) => {
    if (!request.cid) return;
    setIsLoadingReport(true);
    setSelectedReport(null);
    try {
      const response = await axios.get<AnalysisReportData>(`/api/analysis?cid=${request.cid}`);
      setSelectedReport(response.data);
    } catch (error) {
      console.error("Error fetching analysis report:", error);
      alert("Could not load the analysis report.");
    } finally {
      setIsLoadingReport(false);
    }
  };

  if (isLoadingReport || selectedReport) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Analysis Report for {selectedReport?.tokenSymbol}</h2>
          <button
            onClick={() => setSelectedReport(null)}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            &larr; Back to History
          </button>
        </div>
        {isLoadingReport ? (
            <p className="text-gray-600">Loading report...</p>
        ) : selectedReport ? (
            <div className="prose prose-sm max-w-none border-t pt-4 text-gray-900">
                <pre className="whitespace-pre-wrap font-sans">{selectedReport.analysis}</pre>
            </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Your Analysis History</h2>
      {userRequests.length > 0 ? (
        <div className="overflow-x-auto border-b border-gray-200 rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userRequests.map((request) => (
                <tr key={request.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.token}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${request.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        request.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.date.toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {request.status === 'completed' && request.cid && (
                      <button 
                        onClick={() => handleViewReport(request)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Report
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">You have no analysis requests yet.</p>
      )}
    </div>
  );
}