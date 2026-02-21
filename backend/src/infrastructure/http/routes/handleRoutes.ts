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
import paymentRoutes from './PaymentRoutes';
import accountsPayableRoutes from './AccountsPayableRoutes';
import dashboardRoutes from './Dashboard';
import accountsReceivableRoutes from './AccountsReceivableRoutes';
import deliveryRoutes from './DeliveryRoutes';
import purchaseInvoiceRoutes from './PurchaseInvoiceRoutes';
import scheduleRoutes from './ScheduleRoutes';

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
      fastify.register(accountsReceivableRoutes, {prefix: '/accounts-receivable'})
      fastify.register(paymentRoutes, { prefix: '/payment' })
      fastify.register(dashboardRoutes, { prefix: '/dashboard' })
      fastify.register(deliveryRoutes, { prefix: '/delivery' })
      fastify.register(purchaseInvoiceRoutes, { prefix: '/purchase-invoice' })
      fastify.register(scheduleRoutes, { prefix: '/schedule' })
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