import { FastifyInstance } from 'fastify';
import authRoutes from "./authRoutes";
import userRoutes from './UserRoutes'
import productRoutes from './ProductRoutes'
import PartnerRoutes from './PartnerRoutes';
import categoryRoutes from './Category';
export default async function handleRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/',
    {
      schema: {
        hide: true,
      },
    },
    async (request, reply) => {
      return reply.redirect('/docs')
    }
  )
  fastify.register(
    async (fastify) => {
      fastify.register(authRoutes, { prefix: '/auth' })
      fastify.register(userRoutes, { prefix: '/user' })
      fastify.register(productRoutes, { prefix: '/product' })
      fastify.register(PartnerRoutes, { prefix: '/partner' })
      fastify.register(categoryRoutes, { prefix: '/category' })
      fastify.get(
        '/',
        {
          schema: {
            hide: true,
          },
        },
        async (request, reply) => {
          return reply.redirect('/docs')
        }
      )
    },
    { prefix: '/api' }
  )
}