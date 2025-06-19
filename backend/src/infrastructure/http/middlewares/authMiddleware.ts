// src/infrastructure/http/middlewares/authMiddleware.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'seu_jwt_secret_aqui';

// Middleware de autenticação
export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    // Tentar obter o token do cookie
    let token = request.cookies?.access_token;

    // Se não encontrar no cookie, tentar no header Authorization
    if (!token && request.headers.authorization) {
      const authHeader = request.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    console.log('Token:', token ? 'Presente' : 'Ausente');

    if (!token) {
      return reply.code(401).send({
        success: false,
        error: 'Authentication required'
      });
    }

    // Verificar o token
    const decoded = jwt.verify(token, JWT_SECRET);
    //console.log('Token decodificado:', decoded);

    // Adicionar o usuário decodificado à requisição
    request.user = decoded as any;

  } catch (error) {
    console.error('Erro de autenticação:', error);
    return reply.code(401).send({
      success: false,
      error: 'Authentication failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Middleware para verificar roles
export function checkRole(roles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Primeiro autenticar
      await authenticate(request, reply);

      // Se a resposta já foi enviada (por exemplo, se a autenticação falhou), retornar
      if (reply.sent) return;

      // Verificar se o usuário tem a role necessária
      const userRole = (request.user as any)?.role;

      if (!userRole || !roles.includes(userRole)) {
        return reply.code(403).send({
          success: false,
          error: 'Insufficient permissions',
          message: `Required role: ${roles.join(' or ')}`
        });
      }

    } catch (error) {
      console.error('Erro na verificação de role:', error);
      return reply.code(403).send({
        success: false,
        error: 'Permission check failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}

// Adicionar tipos para TypeScript
declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      userId: number;
      email: string;
      role?: string;
      [key: string]: any;
    };
  }
}