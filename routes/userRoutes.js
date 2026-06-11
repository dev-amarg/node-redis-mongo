const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { redisClient } = require('../config/redis');


const ALL_USERS_KEY = 'all_users';

// 1. CREATE – New User
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    
    // Naya user bante hi purana cache turant delete karein
    await redisClient.del(ALL_USERS_KEY);
    console.log("🧹 Redis cache cleared after new user insertion");
    
    res.status(201).json(user);
  } catch (err) {
    console.error("❌ Error in POST /:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 2. READ – Get All Users (Updated with 60 seconds Expiry)

// READ single user

// READ – Get All Users
router.get('/', async (req, res) => {
  const start = Date.now();
  try {
    const cached = await redisClient.get(ALL_USERS_KEY);
    if (cached) {
      const duration = Date.now() - start;
      console.log(`✅ Redis response time: ${duration} ms`);
      
      // 🔥 BADLAV: Direct cached array ko return karein
      return res.json(JSON.parse(cached));
    }

    const users = await User.find().sort({ createdAt: -1 });
    await redisClient.set(ALL_USERS_KEY, JSON.stringify(users), { EX: 60 });
    
    const duration = Date.now() - start;
    console.log(`🐢 MongoDB response time: ${duration} ms`);
    
    // 🔥 BADLAV: Direct users array ko return karein
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});







router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE user
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ error: 'Not found' });
    await redisClient.del(ALL_USERS_KEY);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    await redisClient.del(ALL_USERS_KEY);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
