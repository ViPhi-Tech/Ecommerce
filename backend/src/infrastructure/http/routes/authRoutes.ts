import { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/AuthController';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function authRoutes(fastify: FastifyInstance) {
  const authController = new AuthController(googleClient);

  fastify.post('/token', authController.loginWithEmailPassword.bind(authController));

  fastify.get('/login/google', authController.loginWithGoogle.bind(authController));

  fastify.post('/callback', authController.googleCallback.bind(authController));
}