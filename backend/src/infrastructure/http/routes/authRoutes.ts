import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { authController } from '../../config/dependencies/authDependencies';

export default async function authRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {

  fastify.post('/token', {
    schema: {
      tags: ['auth'],
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 1 }
        }
      }
    },
    handler: authController.login.bind(authController)
  });

  // Obter URL de autenticação do Google
  fastify.get('/login/google', {
    schema: {
      tags: ['auth']
    },
    handler: authController.getGoogleAuthUrl.bind(authController)
  });

  // Callback do Google - suporta tanto código de autorização quanto ID token
  fastify.post('/callback', {
    schema: {
      hide: true,
      body: {
        type: 'object',
        properties: {
          code: { type: 'string' },
          credential: { type: 'string' }
        },
        oneOf: [
          { required: ['code'] },
          { required: ['credential'] }
        ]
      }
    },
    handler: authController.googleCallback.bind(authController)
  });
}