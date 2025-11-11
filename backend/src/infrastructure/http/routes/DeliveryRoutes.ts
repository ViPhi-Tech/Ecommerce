import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { deliveryController } from "../../config/dependencies/deliveryDependencies";
import { authenticate } from "../middlewares/authMiddleware";
import {
  deliveryUuidJsonSchema,
  createDeliveryJsonSchema,
  updateDeliveryJsonSchema,
} from '../../../application/dto/delivery/DeliveryDTOs';
import {
  getDeliveryDashboardJsonSchema,
} from '../../../application/dto/delivery/DeliveryDashboardDTOs';

export default async function deliveryRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.post('/create', {
    schema: {
      tags: ['delivery'],
      description: 'Cria uma nova entrega e pode associar pedidos a ela',
      body: createDeliveryJsonSchema,
    },
    preValidation: [authenticate],
    handler: deliveryController.create.bind(deliveryController),
  });

  fastify.get('/:uuid', {
    schema: {
      tags: ['delivery'],
      description: 'Busca uma entrega pelo UUID',
      params: deliveryUuidJsonSchema,
    },
    preValidation: [authenticate],
    handler: deliveryController.findByUuid.bind(deliveryController),
  });

  fastify.get('/all', {
    schema: {
      tags: ['delivery'],
      description: 'Lista todas as entregas',
    },
    preValidation: [authenticate],
    handler: deliveryController.findAll.bind(deliveryController),
  });

  fastify.patch('/:uuid', {
    schema: {
      tags: ['delivery'],
      description: 'Atualiza uma entrega existente',
      params: deliveryUuidJsonSchema,
      body: updateDeliveryJsonSchema,
    },
    preValidation: [authenticate],
    handler: deliveryController.update.bind(deliveryController),
  });

  fastify.delete('/:uuid', {
    schema: {
      tags: ['delivery'],
      description: 'Deleta uma entrega',
      params: deliveryUuidJsonSchema,
    },
    preValidation: [authenticate],
    handler: deliveryController.delete.bind(deliveryController),
  });

  fastify.patch('/:uuid/complete', {
    schema: {
      tags: ['delivery'],
      description: 'Finaliza uma entrega, alterando o status para "delivered"',
      params: deliveryUuidJsonSchema,
    },
    preValidation: [authenticate],
    handler: deliveryController.complete.bind(deliveryController),
  });

  fastify.get('/dashboard/metrics', {
    schema: {
      tags: ['delivery'],
      description: 'Retorna métricas agregadas de entregas para dashboard (total de entregas, pedidos, valores, etc.)',
      querystring: getDeliveryDashboardJsonSchema,
    },
    preValidation: [authenticate],
    handler: deliveryController.getDashboard.bind(deliveryController),
  });
}

