module.exports = {
  SUPPORTED_TOKENS: ['ETH', 'BTC', 'SOL', 'AVAX', 'MATIC', 'BNB', 'ADA', 'XRP', 'DOT', 'DOGE'],
  ANALYSIS_STATUS: {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed'
  },
  ERROR_MESSAGES: {
    INVALID_TOKEN: 'Unsupported token symbol',
    NETWORK_ERROR: 'Network error occurred',
    AI_SERVICE_ERROR: 'AI service unavailable',
    STORAGE_ERROR: 'Failed to store analysis'
  }
};