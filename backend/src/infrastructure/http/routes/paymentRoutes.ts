import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { paymentController } from '../../config/dependencies/paymentDependencies';
import { paymentTypeJsonSchema } from '../dto/Payment.dto';

export default async function paymentRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.get('/getTypes', {
    schema: {
      tags: ['payment'],
      description: 'Get all payment types',
      summary: 'Get all payment types',
      response: {
        200: {
          type: 'object',
          required: ['status', 'descricao', 'dados'],
          properties: {
            status: { type: 'boolean' },
            descricao: { type: 'string' },
            dados: {
              type: 'array',
              items: paymentTypeJsonSchema,
            },
          },
        },
        500: {
            type: 'object',
            required: ['status', 'descricao', 'dados'],
            properties: {
                status: { type: 'boolean', default: false },
                descricao: { type: 'string' },
                dados: { type: 'null', default: null } 
            }
        }
      },
    },
    handler: paymentController.getTypes.bind(paymentController),
  });
}