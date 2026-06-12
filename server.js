require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const { redisClient, connectRedis } = require('./config/redis');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

console.log('MONGO_URI from env:', process.env.MONGO_URI ? 'SET' : 'NOT SET');
console.log('REDIS_URL from env:', process.env.REDIS_URL ? 'SET' : 'NOT SET');

app.use(express.json());
app.use(express.static('public'));

connectDB();
connectRedis().catch(err => console.error('Redis connection error (non-fatal):', err.message));

// Routes
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// 404 handler for API - Fixed for Express 5 (no wildcard /*)
app.use('/api', (req, res) => {
  // Only if no other route matched (i.e., after all API routes)
  if (req.path !== '/users' && !req.path.startsWith('/users/')) {
    res.status(404).json({ error: 'API endpoint not found' });
  } else {
    // This should not happen because userRoutes handles /users, but just in case
    res.status(404).json({ error: 'Resource not found' });
  }
});

// Fallback for non-API routes (optional, but keeps it clean)
app.use((req, res) => {
  // For any other route not served by static or API, send 404 JSON (not HTML)
  if (!req.path.startsWith('/api')) {
    // For frontend routes, you might want to serve index.html? But here just 404.
    res.status(404).json({ error: 'Not found' });
  }
});

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
