import { FastifyInstance } from 'fastify';
import { authRoutes } from './authRoutes';

export default async function handleRoutes(fastify: FastifyInstance) {
  fastify.register(authRoutes, { prefix: '/auth' });

  fastify.get('/', async (request, reply) => {
    return { message: 'Hello World' };
  });
}