const redis = require("redis");

const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    tls: true 
  },
  password: process.env.REDIS_PASSWORD 
});

redisClient.on("connect", () => console.log("Connected to Redis..."));
redisClient.on("error", (err) => console.error("Redis Connection Failed:", err));

(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
  }
})();

module.exports = redisClient;
