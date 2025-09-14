const axios = require('axios');

// Mock data for MVP - replace with real APIs in later waves
const fetchMarketData = async (tokenSymbol) => {
  console.log(`Fetching market data for ${tokenSymbol}...`);
  
  // For MVP, return mock data
  return {
    price: (Math.random() * 10000).toFixed(2),
    change24h: (Math.random() * 20 - 10).toFixed(2), // -10% to +10%
    volume: (Math.random() * 1000000000).toFixed(0),
    marketCap: (Math.random() * 100000000000).toFixed(0),
    sentiment: Math.floor(Math.random() * 101), // 0-100
    activeAddresses: Math.floor(Math.random() * 50000) + 10000,
    timestamp: new Date().toISOString()
  };
};

module.exports = { fetchMarketData };