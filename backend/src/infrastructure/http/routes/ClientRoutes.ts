import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { clientController } from '../../config/dependencies/clientDependencies';
import { clientCreateJsonSchema, clientIdJsonSchema, clientUpdateJsonSchema, clientDocumentJsonSchema } from '../dto/Client.dto';
import { authenticate } from "../middlewares/authMiddleware";

export default async function clientRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.post('/create', {
    schema: {
      tags: ['client'],
      body: clientCreateJsonSchema,
    },
    handler: clientController.create.bind(clientController),
  });

  fastify.get('/getAll', {
    schema: {
      tags: ['client'],
    },
    handler: clientController.findAll.bind(clientController),
  });

  fastify.get('/findById/:id', {
    schema: {
      tags: ['client'],
      params: clientIdJsonSchema,
    },
    handler: clientController.findById.bind(clientController),
  });

  fastify.put('/update/:id', {
    schema: {
      tags: ['client'],
      params: clientIdJsonSchema,
      body: clientUpdateJsonSchema,
    },
    handler: clientController.update.bind(clientController),
  });

  fastify.delete('/delete/:id', {
    schema: {
      tags: ['client'],
      params: clientIdJsonSchema,
    },
    handler: clientController.delete.bind(clientController),
  });


  fastify.get('findByDocument/:document', {
    schema: {
      tags: ['client'],
      params: clientDocumentJsonSchema
    },

    handler: clientController.findyByDocument.bind(clientController)
  });


}
