import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { dashboardController } from '../../config/dependencies/dashboardDependencies';
import { authenticate } from '../middlewares/authMiddleware';
import { dashboardDateRangeJsonSchema } from '../../../application/dto/dashboard/DashboardDTOs';


export default async function dashboardRoutes(
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {

  fastify.get('/metrics', {
    schema: {
      tags: ['dashboard'],
      params: { type: 'object', properties: {} },
      querystring: dashboardDateRangeJsonSchema,
    },
    preValidation: [authenticate],
    handler: dashboardController.getDashboardMetrics.bind(dashboardController)
  });



  fastify.get('/charts', {
    schema: {
      tags: ['dashboard'],
      params: { type: 'object', properties: {} },
      querystring: dashboardDateRangeJsonSchema,
    },
    preValidation: [authenticate],
    handler: dashboardController.getDashboardCharts.bind(dashboardController)
  });

}
