import { PrismaClient } from '../prismaClient';
import { Login } from '../../../domain/entities/Login';
import { ILoginRepository } from '../../../domain/repositories/ILoginRepository';

export class LoginRepository implements ILoginRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: { email: string; googleId?: string; hashedPassword?: string | null }): Promise<Login> {
    return this.prisma.login.create({
      data: {
        email: data.email,
        googleId: data.googleId,
        hashedPassword: data.hashedPassword ?? null
      }
    });
  }

  async findById(id: number): Promise<Login | null> {
    return this.prisma.login.findUnique({
      where: { id }
    });
  }

  async findByEmail(email: string): Promise<Login | null> {
    return this.prisma.login.findUnique({
      where: { email }
    });
  }

  async findByGoogleId(googleId: string): Promise<Login | null> {
    return this.prisma.login.findUnique({
      where: { googleId: googleId }
    });
  }

  async findByCreatePasswordToken(token: string): Promise<Login | null> {
    return this.prisma.login.findUnique({
      where: { createPasswordToken: token }
    });
  }

  async update(id: number, data: Partial<{
    email: string;
    googleId: string | null;
    hashedPassword: string | null;
    createPasswordToken: string | null;
    createPasswordTokenExpiresAt: Date | null;
  }>): Promise<Login> {
    return this.prisma.login.update({
      where: { id },
      data
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.login.delete({
      where: { id }
    });
  }
}