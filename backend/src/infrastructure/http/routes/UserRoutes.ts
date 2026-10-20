import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { userController } from "../../config/dependencies";
import { authenticate, checkRole } from "../middlewares/authMiddleware";


// Transformando em um plugin Fastify
export default async function userRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  // Criar usuário (senha será criada pelo link enviado por e-mail)
  fastify.post('/create', {
    schema: {
      tags: ['user'],
      body: {
        type: 'object',
        required: ['fullName', 'email', 'roles'],
        properties: {
          fullName: { type: 'string' },
          isActive: { type: 'boolean' },
          email: { type: 'string', format: 'email' },
          googleId: { type: 'string' },
          roles: {
            type: 'array',
            minItems: 1,
            items: {
              type: 'string',
              format: 'uuid'
            },
          }
        }
      }
    },
    preValidation: [authenticate],
    handler: userController.create.bind(userController)
  });

  // Obter todos os usuários
  fastify.get('/', {
    schema: {
      hidden: true,
      tags: ['user'],
      querystring: {
        type: 'object',
        properties: {
          includeLogin: { type: 'boolean' }
        }
      }
    },
    preValidation: [authenticate],
    handler: userController.getAll.bind(userController)
  });

  // Obter usuário por ID
  fastify.get<{ Params: { id: string } }>('/:id', {
    schema: {
      tags: ['user'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', pattern: '^\\d+$' }
        }
      }
    },
    preValidation: [authenticate],
    handler: userController.getById.bind(userController)
  });

  // Atualizar usuário
  fastify.put<{ Params: { id: string } }>('/:id', {
    schema: {
      tags: ['user'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', pattern: '^\\d+$' }
        }
      },
      body: {
        type: 'object',
        properties: {
          fullName: { type: 'string' },
          roles: {
            type: 'array',
            items: { type: 'string', format: 'uuid' }
          }
        }
      }
    },
    preValidation: [authenticate],
    handler: userController.update.bind(userController)
  });

  // Excluir usuário
  fastify.delete<{ Params: { id: string } }>('/:id', {
    schema: {
      tags: ['user'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', pattern: '^\\d+$' }
        }
      }
    },
    preValidation: [authenticate],
    handler: userController.delete.bind(userController)
  });

  fastify.get<{ Params: { id: string } }>('/:id/roles', {
    schema: {
      tags: ['user'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', pattern: '^\\d+$' }
        }
      }
    },
    preValidation: [authenticate],
    handler: userController.getUserRoles.bind(userController)
  }); 
}