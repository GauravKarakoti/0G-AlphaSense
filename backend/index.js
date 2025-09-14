const express = require('express');
const { startEventListener } = require('./services/blockchain');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: '0G-AlphaSense backend is running' });
});

// Start the event listener
startEventListener();

app.listen(PORT, () => {
  console.log(`Backend service running on port ${PORT}`);
});