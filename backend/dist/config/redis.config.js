"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisConfig = void 0;
const config_1 = require("@nestjs/config");
exports.redisConfig = (0, config_1.registerAs)('redis', () => {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    let config = {};
    if (redisUrl.startsWith('redis://')) {
        const url = new URL(redisUrl);
        config = {
            host: url.hostname || process.env.REDIS_HOST || 'localhost',
            port: parseInt(url.port || process.env.REDIS_PORT || '6379', 10),
            password: url.password || process.env.REDIS_PASSWORD || undefined,
            db: parseInt(process.env.REDIS_DB || '0', 10),
        };
    }
    else {
        config = {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379', 10),
            password: process.env.REDIS_PASSWORD,
            db: parseInt(process.env.REDIS_DB || '0', 10),
        };
    }
    return Object.assign(Object.assign({}, config), { maxRetriesPerRequest: 3, retryDelayOnFailover: 100, enableReadyCheck: true });
});
exports.default = exports.redisConfig;
//# sourceMappingURL=redis.config.js.map