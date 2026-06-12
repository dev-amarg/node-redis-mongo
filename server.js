
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

// 404 handler for API (returns JSON, not HTML)
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
