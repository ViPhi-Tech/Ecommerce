import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { fileController } from '../../config/dependencies/fileDependencies';
import { authenticate } from '../middlewares/authMiddleware';
import {
  uploadFileJsonSchema,
  destroyFileJsonSchema
} from '../../../application/dto/file/FileDTOs'

export default async function fileRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.post('/upload', {
    schema: {
      tags: ['file'],
      body: uploadFileJsonSchema,
    },
    preValidation: [authenticate],
    handler: fileController.upload.bind(fileController),
  });

  fastify.delete('/destroy', {
    schema: {
      tags: ['file'],
      body: destroyFileJsonSchema,
    },
    preValidation: [authenticate],
    handler: fileController.destroy.bind(fileController),
  });
}