import { FastifyInstance } from 'fastify';
import authRoutes from "./authRoutes";
import userRoutes from './UserRoutes'
import productRoutes from './ProductRoutes'
import PartnerRoutes from './PartnerRoutes';
import categoryRoutes from './Category';
import orderRoutes from './OrderRoutes';
import fileRoutes from './File';
import clientRoutes from './ClientRoutes';

export default async function handleRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/',
    {
      schema: {
        hide: true,
      },
    },
    async (request, reply) => {
      return reply.redirect('/api/docs')
    }
  )
  fastify.register(
    async (fastify) => {
      fastify.register(authRoutes, { prefix: '/auth' })
      fastify.register(userRoutes, { prefix: '/user' })
      fastify.register(productRoutes, { prefix: '/product' })
      fastify.register(PartnerRoutes, { prefix: '/partner' })
      fastify.register(categoryRoutes, { prefix: '/category' })
      fastify.register(orderRoutes, { prefix: '/order' })
      fastify.register(fileRoutes, { prefix: '/file' })
      fastify.register(clientRoutes, {prefix: '/client'})
      fastify.get(
        '/',
        {
          schema: {
            hide: true,
          },
        },
        async (request, reply) => {
          return reply.redirect('/api/docs')
        }
      )
    },
    { prefix: '/api' }
  )
}