import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { partnerController } from '../../config/dependencies/partnerDependencies';
import { createPartnerJsonSchema, partnerIdJsonSchema, updatePartnerJsonSchema } from '../../../application/dto/partner/PartnerDTOs';

export default async function partnerRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.post('/create', {
    schema: {
      tags: ['partner'],
      body: createPartnerJsonSchema,
    },
    handler: partnerController.create.bind(partnerController),
  });

  fastify.get('/', {
    schema: {
      tags: ['partner'],
    },
    handler: partnerController.findAll.bind(partnerController),
  });

  fastify.get('/:id', {
    schema: {
      tags: ['partner'],
      params: partnerIdJsonSchema,
    },
    handler: partnerController.findById.bind(partnerController),
  });

  fastify.put('/:id', {
    schema: {
      tags: ['partner'],
      params: partnerIdJsonSchema,
      body: updatePartnerJsonSchema,
    },
    handler: partnerController.update.bind(partnerController),
  });

  fastify.delete('/:id', {
    schema: {
      tags: ['partner'],
      params: partnerIdJsonSchema,
    },
    handler: partnerController.delete.bind(partnerController),
  });
}