require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const { redisClient, connectRedis } = require('./config/redis');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Database connection
connectDB();

// Redis connection
connectRedis();

// Routes
app.use('/api/users', userRoutes);

// Start server
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
