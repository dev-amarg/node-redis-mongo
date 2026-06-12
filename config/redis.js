const redis = require('redis');

const redisClient = redis.createClient({
	//  socket: {
    //host: process.env.REDIS_HOST,
    //port: process.env.REDIS_PORT
	url: process.env.REDIS_URL
  //}
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

redisClient.on('connect', () => {
  console.log('Redis connected successfully');
});

const connectRedis = async () => {
  await redisClient.connect();
};

module.exports = { redisClient, connectRedis };

