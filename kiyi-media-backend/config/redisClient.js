const Redis = require('ioredis');

const REDIS_URL = process.env.REDIS_URL;

let redisClient = null;

if (REDIS_URL) {
    redisClient = new Redis(REDIS_URL, {
        retryStrategy: (times) => {
            // Redis bağlantısı koparsa 5 saniye sonra tekrar dene
            if (times > 5) {
                console.error('Redis connection failed too many times. Disabling Redis.');
                return null;
            }
            return Math.min(times * 100, 5000);
        }
    });

    redisClient.on('connect', () => console.log('✅ Redis Bağlantısı Başarılı!'));
    redisClient.on('error', (err) => console.error('❌ Redis Hatası:', err.message));
} else {
    console.log('⚠️ REDIS_URL bulunamadı. Caching devre dışı.');
}

module.exports = redisClient;
