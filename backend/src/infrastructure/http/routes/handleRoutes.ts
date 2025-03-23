import { FastifyInstance } from 'fastify';
import authRoutes from './AuthRoutes';
import userRoutes from './UserRoutes';

export default async function handleRoutes(fastify: FastifyInstance) {
  // Registrar todas as rotas com o prefixo '/api'
  fastify.register(async (fastify) => {
    // Registrar rotas de autenticação com prefixo '/auth'
    fastify.register(authRoutes, { prefix: '/auth' });

    // Registrar rotas de usuário com prefixo '/users'
    fastify.register(userRoutes, { prefix: '/user' });

    // Rota raiz (agora acessível em /api/)
    fastify.get('/', async (request, reply) => {
      return { message: 'Hello World' };
    });

  }, { prefix: '/api' }); // Prefixo global '/api'
}