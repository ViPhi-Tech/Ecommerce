import { FastifyInstance } from 'fastify';
import authRoutes from "./authRoutes";
import userRoutes from './UserRoutes'
import productRoutes from './ProductRoutes'
import partnerRoutes from './PartnerRoutes';
import categoryRoutes from './Category';
import orderRoutes from './OrderRoutes';
import fileRoutes from './File';
import clientRoutes from './ClientRoutes';
import invoiceRoutes from './InvoiceRoutes';
import brandRoutes from './Brand';
import supplierRoutes from './Supplier';
import { accountsPayableRoutes } from './AccountsPayableRoutes';
import paymentRoutes from './paymentRoutes';

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
      fastify.register(partnerRoutes, { prefix: '/partner' })
      fastify.register(categoryRoutes, { prefix: '/category' })
      fastify.register(orderRoutes, { prefix: '/order' })
      fastify.register(fileRoutes, { prefix: '/file' })
      fastify.register(clientRoutes, {prefix: '/client'})
      fastify.register(invoiceRoutes, { prefix: '/invoices' })
      fastify.register(brandRoutes, { prefix: '/brand' })
      fastify.register(supplierRoutes, { prefix: '/supplier' })
      fastify.register(accountsPayableRoutes, { prefix: '/accounts-payable' })
      fastify.register(paymentRoutes, { prefix: '/payment' })
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