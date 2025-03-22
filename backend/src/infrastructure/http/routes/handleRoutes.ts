import { FastifyInstance } from 'fastify';
import authRoutes from './AuthRoutes';
import userRoutes from './UserRoutes';

export default async function handleRoutes(fastify: FastifyInstance) {
  // Registrar rotas com prefixos
  fastify.register(authRoutes, { prefix: '/auth' });
  fastify.register(userRoutes, { prefix: '/users' });

  // Rota raiz
  fastify.get('/', async (request, reply) => {
    return { message: 'Hello World' };
  });

  // Rota de saúde
  fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });
}