import { registerAs } from '@nestjs/config';

export const redisConfig = registerAs('redis', () => {
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  
  // Parse Redis URL if provided, otherwise use individual config
  let config: any = {};
  
  if (redisUrl.startsWith('redis://')) {
    const url = new URL(redisUrl);
    config = {
      host: url.hostname || process.env.REDIS_HOST || 'localhost',
      port: parseInt(url.port || process.env.REDIS_PORT || '6379', 10),
      password: url.password || process.env.REDIS_PASSWORD || undefined,
      db: parseInt(process.env.REDIS_DB || '0', 10),
    };
  } else {
    config = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB || '0', 10),
    };
  }

  return {
    ...config,
    maxRetriesPerRequest: 3,
    retryDelayOnFailover: 100,
    enableReadyCheck: true,
    // TLS for production (if needed)
    // tls: process.env.NODE_ENV === 'production' ? {} : undefined,
  };
});

export default redisConfig;






