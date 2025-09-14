const { SUPPORTED_TOKENS } = require('./constants');

const validateTokenSymbol = (symbol) => {
  return SUPPORTED_TOKENS.includes(symbol.toUpperCase());
};

const formatTokenSymbol = (symbol) => {
  return symbol.toUpperCase();
};

const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const generateRequestId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

module.exports = {
  validateTokenSymbol,
  formatTokenSymbol,
  delay,
  generateRequestId
};