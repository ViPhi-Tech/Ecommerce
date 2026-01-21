import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { purchaseInvoiceController } from '../../config/dependencies/purchaseInvoiceDependencies';
import { authenticate } from '../middlewares/authMiddleware';
import { createPurchaseInvoiceJsonSchema } from '../../../application/dto/purchaseInvoice/PurchaseInvoiceDTOs';

export default async function purchaseInvoiceRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.post('/create', {
    schema: {
      tags: ['purchase-invoice'],
      body: createPurchaseInvoiceJsonSchema,
    },
    preValidation: [authenticate],
    handler: purchaseInvoiceController.create.bind(purchaseInvoiceController),
  });
}
