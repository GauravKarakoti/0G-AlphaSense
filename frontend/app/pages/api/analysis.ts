import { NextApiRequest, NextApiResponse } from 'next';

// This is a mock API endpoint that would interact with your backend service
// to fetch the full analysis report from 0G Storage or IPFS.

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { cid } = req.query;

  if (!cid || typeof cid !== 'string') {
    return res.status(400).json({ message: 'CID parameter is required' });
  }

  try {
    // In a real implementation, you would fetch the full data object from storage.
    // For this example, we'll use detailed mock data.
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const fullAnalysisReport = {
      requestId: '1',
      tokenSymbol: 'ETH',
      user: '0x1234...5678',
      analysis: `# Market Analysis for ETH

## Price Data
- **Current Price:** $3,456.78
- **24h Change:** +2.34%
- **Trading Volume:** $12,345,678,901
- **Market Cap:** $415,234,567,890

## Market Sentiment
- **Social Media Score:** 82/100 (Bullish)
- **On-Chain Activity:** 45,678 active addresses (High)

## Detailed Analysis
Ethereum is exhibiting strong bullish indicators, driven by increased network activity and overwhelmingly positive social sentiment. The latest network upgrade has significantly improved transaction efficiency while reducing gas fees, which is fostering greater adoption and utility across the ecosystem.

## Recommendation
Based on the data, a strategy of accumulating on price dips is advisable. The robust fundamentals, coupled with a growing and vibrant ecosystem, strongly support the potential for long-term value appreciation.

*This report was generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}*`,
      timestamp: new Date().toISOString()
    };

    // **SOLUTION:** Create a new object with only the required fields.
    const responseData = {
        tokenSymbol: fullAnalysisReport.tokenSymbol,
        analysis: fullAnalysisReport.analysis
    };

    res.status(200).json(responseData);

  } catch (error) {
    console.error(`Error fetching analysis for CID ${cid}:`, error);
    res.status(500).json({ message: 'Failed to fetch analysis from storage' });
  }
}