import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { scheduleController } from '../../config/dependencies/scheduleDependencies';
import { authenticate } from '../middlewares/authMiddleware';
import {
  createScheduleJsonSchema,
  updateScheduleJsonSchema,
  scheduleIdJsonSchema,
} from '../../../application/dto/schedule/ScheduleDTOs';

export default async function scheduleRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.post('/create', {
    schema: {
      tags: ['schedule'],
      body: createScheduleJsonSchema,
    },
    preValidation: [authenticate],
    handler: scheduleController.create.bind(scheduleController),
  });

  fastify.get('/:id', {
    schema: {
      tags: ['schedule'],
      params: scheduleIdJsonSchema,
    },
    preValidation: [authenticate],
    handler: scheduleController.findById.bind(scheduleController),
  });

  fastify.get('/all', {
    schema: {
      tags: ['schedule'],
    },
    preValidation: [authenticate],
    handler: scheduleController.findAll.bind(scheduleController),
  });

  fastify.patch('/:id', {
    schema: {
      tags: ['schedule'],
      params: scheduleIdJsonSchema,
      body: updateScheduleJsonSchema,
    },
    preValidation: [authenticate],
    handler: scheduleController.update.bind(scheduleController),
  });

  fastify.delete('/:id', {
    schema: {
      tags: ['schedule'],
      params: scheduleIdJsonSchema,
    },
    preValidation: [authenticate],
    handler: scheduleController.delete.bind(scheduleController),
  });

  fastify.get('/today', {
    schema: {
      tags: ['schedule'],
    },
    preValidation: [authenticate],
    handler: scheduleController.findToday.bind(scheduleController),
  });
}
