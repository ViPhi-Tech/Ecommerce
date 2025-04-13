// backend/src/infrastructure/plugins/cache.ts
import fp from 'fastify-plugin';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { redis } from '../database/redisClient';
import { RedisCacheService } from '../services/RedisCacheService';

export default fp(async (fastify: FastifyInstance) => {
  // Criar serviço de cache
  const cacheService = new RedisCacheService(redis);
  
  // Adicionar ao contexto do Fastify
  fastify.decorate('cacheService', cacheService);
  
  // Adicionar helpers para gerenciamento de cache
  fastify.decorate('cacheManager', {
    /**
     * Cria uma chave padronizada para o cache
     */
    createKey: (entity: string, id: string | number, ...segments: string[]): string => {
      return [entity, id.toString(), ...segments].join(':');
    },
    
    /**
     * Invalida o cache de uma entidade
     */
    invalidateEntityCache: async (entity: string, id: string | number): Promise<void> => {
      await cacheService.delPattern(`${entity}:${id}:*`);
      await cacheService.del(`${entity}:${id}`);
    },
    
    /**
     * Obtém um valor do cache ou executa uma função para obtê-lo
     */
    getOrSet: async <T>(
      key: string, 
      fallbackFn: () => Promise<T>, 
      ttlSeconds = 3600
    ): Promise<T> => {
      return cacheService.getOrSet(key, fallbackFn, ttlSeconds);
    },
    
    /**
     * Decorator para cachear respostas de rotas
     */
    cacheRoute: (keyPrefix: string, ttlSeconds = 3600) => {
      return (request: FastifyRequest, reply: FastifyReply, done: () => void) => {
        const originalSend = reply.send;
        
        // Criar chave baseada no método, URL e query params
        const url = request.url;
        const method = request.method;
        const cacheKey = `route:${keyPrefix}:${method}:${url}`;
        
        // Verificar se a resposta está no cache
        cacheService.get(cacheKey)
          .then(cachedResponse => {
            if (cachedResponse) {
              // Se estiver no cache, enviar diretamente
              originalSend.call(reply, cachedResponse);
            } else {
              // Se não estiver, interceptar a resposta para cachear
              reply.send = function(payload) {
                // Cachear a resposta
                cacheService.set(cacheKey, payload, ttlSeconds)
                  .catch(err => fastify.log.error(`Error caching response: ${err}`));
                
                // Enviar a resposta original
                return originalSend.call(this, payload);
              };
              done();
            }
          })
          .catch(err => {
            fastify.log.error(`Cache error: ${err}`);
            done();
          });
      };
    }
  });
  
  // Limpar conexão quando o servidor for fechado
  fastify.addHook('onClose', async () => {
    await redis.quit();
  });
});

// Adicionar tipos para TypeScript
declare module 'fastify' {
  interface FastifyInstance {
    cacheService: RedisCacheService;
    cacheManager: {
      createKey: (entity: string, id: string | number, ...segments: string[]) => string;
      invalidateEntityCache: (entity: string, id: string | number) => Promise<void>;
      getOrSet: <T>(key: string, fallbackFn: () => Promise<T>, ttlSeconds?: number) => Promise<T>;
      cacheRoute: (keyPrefix: string, ttlSeconds?: number) => (request: FastifyRequest, reply: FastifyReply, done: () => void) => void;
    };
  }
}