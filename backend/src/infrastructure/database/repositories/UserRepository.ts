// backend/src/infrastructure/database/repositories/UserRepository.ts
import { PrismaClient } from '@prisma/client';
import { User } from '../../../domain/entities/User';
import { IUserRepository } from '../../../domain/repositories/UserRepository';

export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: { full_name: string; is_active?: boolean; login_id: number }): Promise<User> {
    return this.prisma.user.create({
      data
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id }
    });
  }

  async findByLoginId(loginId: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { login_id: loginId }
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findAllWithLogin(): Promise<(User & { login: any })[]> {
    return this.prisma.user.findMany({
      include: {
        login: true
      }
    });
  }

  async update(id: number, data: Partial<{ full_name: string; is_active: boolean }>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({
      where: { id }
    });
  }

  // Implementação dos métodos adicionais exigidos pela interface
  async create_user(userData: { full_name: string; is_active?: boolean; login_id: number }): Promise<User> {
    return this.create(userData);
  }

  async get_or_create_user_by_google(googleId: string, email: string, name: string): Promise<User> {
    // Primeiro, tentamos encontrar o login associado ao googleId
    const login = await this.prisma.login.findFirst({
      where: { google_id: googleId }
    });

    if (login) {
      // Se encontrarmos o login, buscamos o usuário associado
      const user = await this.findByLoginId(login.id);
      if (user) return user;
    }

    // Se não encontrarmos o login ou o usuário, criamos um novo login e usuário
    const newLogin = await this.prisma.login.create({
      data: {
        email,
        google_id: googleId,
        hashed_password: 'google'
        // Outros campos necessários para o login
      }
    });

    return this.create({
      full_name: name,
      is_active: true,
      login_id: newLogin.id
    });
  }

  async create_access_token_for_user(userId: number, token: string): Promise<void> {
    // Implementação depende de como você está armazenando tokens
    await this.prisma.$executeRaw`INSERT INTO tokens (user_id, token, created_at) VALUES (${userId}, ${token}, NOW())`;
  }

  async get_user_by_email(email: string): Promise<User | null> {
    // Primeiro encontramos o login com o email
    const login = await this.prisma.login.findUnique({
      where: { email }
    });

    if (!login) return null;

    // Depois encontramos o usuário associado ao login
    return this.findByLoginId(login.id);
  }

  async authenticate_user(email: string, password: string): Promise<User | null> {
    // Este método provavelmente deveria estar em um serviço de autenticação
    // e não no repositório, mas estamos implementando para satisfazer a interface
    
    // Primeiro encontramos o login com o email
    const login = await this.prisma.login.findUnique({
      where: { email }
    });

    if (!login) return null;

    // A verificação de senha deve ser feita em um serviço separado
    // Aqui apenas retornamos o usuário associado ao login
    return this.findByLoginId(login.id);
  }
}