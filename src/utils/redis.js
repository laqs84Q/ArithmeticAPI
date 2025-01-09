const { createClient } = require("redis");

const redisClient = createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

module.exports = redisClient;
