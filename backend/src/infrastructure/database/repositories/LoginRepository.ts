import { PrismaClient } from '@prisma/client';
import { Login } from '../../../domain/entities/Login';
import { ILoginRepository } from '../../../domain/repositories/LoginRepository';

export class LoginRepository implements ILoginRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: { email: string; google_id?: string; hashed_password: string }): Promise<Login> {
    return this.prisma.login.create({
      data
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
      where: { google_id: googleId }
    });
  }

  async update(id: number, data: { email?: string; google_id?: string | null; hashed_password?: string }): Promise<Login> {
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