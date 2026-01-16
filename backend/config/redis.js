const Redis = require("ioredis");
const dotenv = require("dotenv");
dotenv.config()

if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL is not defined in .env");
}

const redis = new Redis(process.env.REDIS_URL);

// Listen for events
redis.on('ready', () => {
    console.log('ioredis client is connected and ready.');
});

redis.on('error', (err) => {
    console.error('ioredis Client Error:', err);
});

if (redis.status === 'ready') {
    console.log('Current status is ready.');
} else {
    console.log(`Current status is: ${redis.status}`);
}

module.exports = redis;
