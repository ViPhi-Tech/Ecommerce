import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { invoiceController } from '../../config/dependencies/invoiceDependencies';
import { authenticate } from '../middlewares/authMiddleware';
import {
  invoiceIdJsonSchema,
  invoiceJsonSchema
} from '../dto/Invoice.dto';

export default async function invoiceRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.post('/create', {
    schema: {
      tags: ['invoice'],
      body: invoiceJsonSchema
    },
    preValidation: [authenticate],
    handler: invoiceController.create.bind(invoiceController) 
  });

  fastify.get('/:id', {
    schema: {
      tags: ['invoice'],
      params: invoiceIdJsonSchema
    },
    preValidation: [authenticate],
    handler: invoiceController.findById.bind(invoiceController) 
  });

  fastify.get('/', {
    schema: {
      tags: ['invoice']
    },
    preValidation: [authenticate],
    handler: invoiceController.findAll.bind(invoiceController) 
  });

  fastify.put('/:id', {
    schema: {
      tags: ['invoice'],
      body: invoiceJsonSchema
    },
    preValidation: [authenticate],
    handler: invoiceController.update.bind(invoiceController) 
  });

  fastify.delete('/:id', {
    schema: {
      tags: ['invoice'],
      params: {}
    },
    preValidation: [authenticate],
    handler: invoiceController.delete.bind(invoiceController)
  });


}