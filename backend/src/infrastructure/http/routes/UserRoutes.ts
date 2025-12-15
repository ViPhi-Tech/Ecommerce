import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { userController } from "../../config/dependencies";
import { authenticate, checkRole } from "../middlewares/authMiddleware";


// Transformando em um plugin Fastify
export default async function userRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  // Criar usuário
fastify.post('/create', {
  schema: {
    tags: ['user'],
    body: {
      type: 'object',
      required: ['fullName', 'email', 'password'],
      properties: {
        fullName: { type: 'string' },
        isActive: { type: 'boolean' },
        email: { type: 'string', format: 'email' },
        googleId: { type: 'string' },
        password: { type: 'string', minLength: 6 },
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
          user: {
            type: 'object',
            properties: {
              fullName: { type: 'string' },
              isActive: { type: 'boolean' }
            }
          },
          login: {
            type: 'object',
            properties: {
              email: { type: 'string', format: 'email' },
              googleId: { type: 'string' },
              password: { type: 'string', minLength: 6 }
            }
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