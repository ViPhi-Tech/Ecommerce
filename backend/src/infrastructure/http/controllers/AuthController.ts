import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthUseCase } from '../../../application/use-cases/auth/AuthUseCase';
import { SetInitialPasswordUseCase } from '../../../application/use-cases/auth/SetInitialPasswordUseCase';
import { LoginDTO, GoogleLoginDTO, loginSchema, googleLoginSchema } from '../../../application/dto/auth/AuthDTOs';
import { InvalidCredentialsError } from '../../../shared/errors/UserErrors';

export class AuthController {
  constructor(
    private authUseCase: AuthUseCase,
    private setInitialPasswordUseCase: SetInitialPasswordUseCase
  ) {}

  async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const loginData = request.body as LoginDTO;
      const result = await this.authUseCase.login(loginData);

      if (result.token) {
        reply.setCookie('access_token', result.token, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          path: '/'
        });
      }

      return reply.code(200).send({
        status: result.status,
        descricao: result.descricao
      });
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        return reply.code(401).send({
          status: false,
          descricao: error.message
        });
      }
      
      return reply.code(500).send({
        status: false,
        descricao: 'Erro interno do servidor'
      });
    }
  }

  async loginAngular(request: FastifyRequest, reply: FastifyReply) {
    try {
      const loginData = request.body as LoginDTO;
      const result = await this.authUseCase.login(loginData);

      if (result.token) {
        return reply.code(200).send({
          status: result.status,
          descricao: result.descricao,
          accessToken: result.token
        });
      }

    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        return reply.code(401).send({
          status: false,
          descricao: error.message
        });
      }
      
      return reply.code(500).send({
        status: false,
        descricao: 'Erro interno do servidor'
      });
    }
  }

  async getGoogleAuthUrl(request: FastifyRequest, reply: FastifyReply) {
    try {
      const url = this.authUseCase.getGoogleAuthUrl();
      
      return reply.code(200).send({
        redirect_url: url
      });
    } catch (error) {
      console.error(error);
      return reply.code(500).send({
        status: false,
        descricao: 'Erro ao gerar URL de autenticação do Google'
      });
    }
  }

  async googleCallback(request: FastifyRequest, reply: FastifyReply) {
    try {
      // Verificar se é um callback com código ou com ID token
      const body = request.body as any;
      
      let result;
      
      if (body.code) {
        // Fluxo de redirecionamento (código de autorização)
        result = await this.authUseCase.googleLoginWithCode(body.code);
      } else if (body.credential) {
        // Fluxo de botão de login (ID token)
        result = await this.authUseCase.googleLogin({ credential: body.credential });
      } else {
        return reply.code(400).send({
          status: false,
          descricao: 'Parâmetros de autenticação Google não fornecidos'
        });
      }

      // Definir cookie com o token JWT
      if (result.token) {
        reply.setCookie('access_token', result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/'
        });
      }

      return reply.code(200).send({
        status: result.status,
        descricao: result.descricao
      });
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        return reply.code(401).send({
          status: false,
          descricao: 'Credenciais inválidas'
        });
      }
      
      console.error(error);
      return reply.code(500).send({
        status: false,
        descricao: 'Erro interno do servidor'
      });
    }
  }

  async setInitialPassword(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as { token: string; password: string };
      if (!body.token || !body.password) {
        return reply.code(400).send({
          message: 'Token e senha são obrigatórios.'
        });
      }
      await this.setInitialPasswordUseCase.execute(body.token, body.password);
      return reply.code(200).send({
        message: 'Senha criada com sucesso. Você já pode fazer login.'
      });
    } catch (error: any) {
      const message = error?.message || 'Erro ao definir senha.';
      const isBadRequest = message.includes('inválido') || message.includes('expirado');
      return reply.code(isBadRequest ? 400 : 500).send({ message });
    }
  }
}