import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { dashboardController } from '../../config/dependencies/dashboardDependencies';
import { authenticate } from '../middlewares/authMiddleware';


export default async function dashboardRoutes(
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {

  fastify.get('/metrics', {
    schema: {
      tags: ['dashboard'],
      params: '',
    },
    preValidation: [authenticate],
    handler: dashboardController.getDashboardMetrics.bind(dashboardController)
  });


}
