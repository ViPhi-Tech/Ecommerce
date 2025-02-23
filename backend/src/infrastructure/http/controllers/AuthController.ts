// ecommerce/backend/src/infrastructure/http/controllers/AuthController.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { userService } from '../../../domain/services/userService';
import { OAuth2Client } from 'google-auth-library';

export class AuthController {
  private userService = userService;
  private googleClient: OAuth2Client;

  constructor(googleClient: OAuth2Client) {
    this.userService = userService;
    this.googleClient = googleClient;
  };

  async loginWithEmailPassword(request: FastifyRequest, response: FastifyReply) {
    const { username, password } = request.body as { username: string; password: string };

    try {
      const user = await this.userService.authenticateUser(username, password);
      const accessToken = await this.userService.createAccessTokenForUser(user);

      response.setCookie('access_token', accessToken, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Só usa secure em produção
        sameSite: 'lax',
      });

      return { status: true, descricao: 'Login realizado com sucesso!' };
    } catch (error) {
        response.status(401).send({ error: error });
    }
  };

  async loginWithGoogle(request: FastifyRequest, reply: FastifyReply) {
    const redirectUrl = this.googleClient.generateAuthUrl({
      access_type: 'offline',
      scope: ['profile', 'email'],
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    });

    return { redirect_url: redirectUrl };
  };

  async googleCallback(request: FastifyRequest, reply: FastifyReply) {
    const { credential } = request.body as { credential: string };

    if (!credential) {
      reply.status(400).send({ error: 'Credencial não fornecida' });
      return;
    }

    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const userInfo = ticket.getPayload();
      if (!userInfo) {
        throw new Error('Falha ao autenticar com o Google');
      }

      const user = await this.userService.getOrCreateUserByGoogle(userInfo);
      const accessToken = await this.userService.createAccessTokenForUser(user);

      reply.setCookie('access_token', accessToken, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Só usa secure em produção
        sameSite: 'lax',
      });

      return { status: true, descricao: 'Login realizado com sucesso!' };
    } catch (error) {
      reply.status(400).send({ error: error });
    }
  };
}