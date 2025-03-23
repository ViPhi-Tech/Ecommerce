import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { userController } from '../../config/dependencies/userDependencies';

// Transformando em um plugin Fastify
export default async function userRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  // Criar usuário
  fastify.post('/create', {
    schema: {
      body: {
        type: 'object',
        required: ['full_name', 'email', 'password'],
        properties: {
          full_name: { type: 'string' },
          is_active: { type: 'boolean' },
          login: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
              email: { type: 'string', format: 'email' },
              google_id: { type: 'string' },
              password: { type: 'string', minLength: 6 }
            }
          }
        }
      }
    },
    handler: userController.create.bind(userController)
  });

  // Obter todos os usuários
  fastify.get('/', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          includeLogin: { type: 'boolean' }
        }
      }
    },
    handler: userController.getAll.bind(userController)
  });

  // Obter usuário por ID
  fastify.get('/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', pattern: '^\\d+$' }
        }
      }
    },
    handler: userController.getById.bind(userController)
  });

  // Atualizar usuário
  fastify.put('/:id', {
    schema: {
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
              full_name: { type: 'string' },
              is_active: { type: 'boolean' }
            }
          },
          login: {
            type: 'object',
            properties: {
              email: { type: 'string', format: 'email' },
              google_id: { type: 'string' },
              password: { type: 'string', minLength: 6 }
            }
          }
        }
      }
    },
    handler: userController.update.bind(userController)
  });

  // Excluir usuário
  fastify.delete('/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', pattern: '^\\d+$' }
        }
      }
    },
    handler: userController.delete.bind(userController)
  });
}