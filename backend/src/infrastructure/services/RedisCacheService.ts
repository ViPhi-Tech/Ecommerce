// backend/src/infrastructure/services/RedisCacheService.ts
import { Redis } from 'ioredis';
import { ICacheService } from '../../domain/services/ICacheService';

export class RedisCacheService implements ICacheService {
  constructor(private redis: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.redis.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error) {
      console.error(`Error getting cache for key ${key}:`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);
      if (ttlSeconds) {
        await this.redis.setex(key, ttlSeconds, stringValue);
      } else {
        await this.redis.set(key, stringValue);
      }
    } catch (error) {
      console.error(`Error setting cache for key ${key}:`, error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error(`Error deleting cache for key ${key}:`, error);
    }
  }

  async delPattern(pattern: string): Promise<void> {
    try {
      let cursor = '0';
      do {
        const [nextCursor, keys] = await this.redis.scan(
          cursor, 
          'MATCH', 
          pattern,
          'COUNT',
          '100'
        );
        
        cursor = nextCursor;
        
        if (keys.length > 0) {
          await this.redis.del(...keys);
        }
      } while (cursor !== '0');
    } catch (error) {
      console.error(`Error deleting cache pattern ${pattern}:`, error);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`Error checking if key ${key} exists:`, error);
      return false;
    }
  }

  async increment(key: string, increment: number = 1): Promise<number> {
    try {
      if (increment === 1) {
        return this.redis.incr(key);
      } else {
        return this.redis.incrby(key, increment);
      }
    } catch (error) {
      console.error(`Error incrementing key ${key}:`, error);
      return 0;
    }
  }

  async getOrSet<T>(key: string, fallbackFn: () => Promise<T>, ttlSeconds?: number): Promise<T> {
    try {
      // Tentar obter do cache
      const cachedValue = await this.get<T>(key);
      if (cachedValue !== null) {
        return cachedValue;
      }

      // Se não estiver no cache, executar a função
      const value = await fallbackFn();
      
      // Armazenar no cache se não for null ou undefined
      if (value !== null && value !== undefined) {
        await this.set(key, value, ttlSeconds);
      }
      
      return value;
    } catch (error) {
      console.error(`Error in getOrSet for key ${key}:`, error);
      // Se ocorrer um erro, executar a função diretamente
      return fallbackFn();
    }
  }
}