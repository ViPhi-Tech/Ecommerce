import { FastifyInstance } from 'fastify';
import authRoutes from './AuthRoutes';
import userRoutes from './UserRoutes';

export default async function handleRoutes(fastify: FastifyInstance) {
  // Registrar todas as rotas com o prefixo '/api'
  fastify.register(async (fastify) => {
    fastify.register(authRoutes, { prefix: '/auth' });

    fastify.get('/', async (request, reply) => {
      return { message: 'API funcionando!' };
    });

    fastify.register(userRoutes, { prefix: '/user' });

    // Você pode adicionar outras rotas aqui conforme necessário

  }, { prefix: '/api' });
}