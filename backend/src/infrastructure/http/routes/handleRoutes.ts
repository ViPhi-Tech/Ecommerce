import { FastifyInstance } from 'fastify';
import authRoutes from './AuthRoutes';
import userRoutes from './UserRoutes';

export default async function handleRoutes(fastify: FastifyInstance) {
  // Registrar todas as rotas com o prefixo '/api'
  fastify.get('/', {
    schema: {
      hide: true,
    }
  }, async (request, reply) => {
    return reply.redirect('/docs');
  });


  // Todas rotas com prefixo /api
  fastify.register(async (fastify) => {
    fastify.register(authRoutes, { prefix: '/auth' });
    fastify.register(userRoutes, { prefix: '/user' });

    fastify.get('/', {
      schema: {
        hide: true,
      }
    }, async (request, reply) => {
      return reply.redirect('/docs');
    });

  }, { prefix: '/api' });
}