import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { paymentController } from '../../config/dependencies/paymentDependencies';
import { paymentTypeJsonSchema } from '../../http/dto/Payment.dto';



export default async function partnerRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.get('/getTypes', {
    schema: {
      tags: ['payment'],
      response: {
        200: {
          type: 'array',
          items: paymentTypeJsonSchema
        }
      }
    },
    handler: paymentController.getTypes.bind(paymentController),
  });
}
