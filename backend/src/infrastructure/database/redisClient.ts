// backend/src/infrastructure/database/redisClient.ts
import Redis from 'ioredis';

// Configurações do Redis
const redisOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  // Reconexão automática
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
};

// Criar cliente Redis
export const redis = new Redis(redisOptions);

// Tratamento de eventos
redis.on('error', (error) => {
  console.error('Redis connection error:', error);
});

redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('reconnecting', () => {
  console.log('Reconnecting to Redis...');
});

// Função para verificar a conexão
export const pingRedis = async (): Promise<boolean> => {
  try {
    const result = await redis.ping();
    return result === 'PONG';
  } catch (error) {
    console.error('Redis ping failed:', error);
    return false;
  }
};