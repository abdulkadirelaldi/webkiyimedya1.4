const redisClient = require('../config/redisClient');

const cache = (duration = 3600) => {
    return async (req, res, next) => {
        // Redis kapalıysa direkt devam et
        if (!redisClient || redisClient.status !== 'ready') {
            return next();
        }

        const key = `__express__${req.originalUrl || req.url}`;

        try {
            const cachedResponse = await redisClient.get(key);
            if (cachedResponse) {
                // Cache HIT
                res.setHeader('X-Cache', 'HIT');
                return res.json(JSON.parse(cachedResponse));
            } else {
                // Cache MISS
                // res.json metodunu override ediyoruz
                res.originalSend = res.json;
                res.json = (body) => {
                    res.originalSend(body);
                    // 200 OK ise cache'e kaydet
                    if (res.statusCode === 200) {
                        redisClient.set(key, JSON.stringify(body), 'EX', duration);
                    }
                };
                res.setHeader('X-Cache', 'MISS');
                next();
            }
        } catch (err) {
            console.error('Redis Cache Error:', err);
            next();
        }
    };
};

module.exports = cache;
