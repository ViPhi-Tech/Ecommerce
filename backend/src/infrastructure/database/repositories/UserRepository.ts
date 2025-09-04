import { PrismaClient } from '@prisma/client';
import { User } from '../../../domain/entities/User';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';

export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: { fullName: string; isActive?: boolean; loginId: number }): Promise<User> {
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
  const user = await this.prisma.user.findUnique({
    where: { loginId },
    include: {
      roles: {
        select: { roleId: true }
      }
    }
  });

  if (!user) return null;

  return {
    ...user,
    roles: user.roles.map(r => r.roleId)
  };
};


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

  async update(id: number, data: Partial<{ fullName: string; isActive: boolean }>): Promise<User> {
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
  async create_user(userData: { fullName: string; isActive?: boolean; loginId: number }): Promise<User> {
    return this.create(userData);
  }

  async get_or_create_user_by_google(googleId: string, email: string, name: string): Promise<User> {
    const login = await this.prisma.login.findFirst({
      where: { googleId: googleId }
    });

    if (login) {
      const user = await this.findByLoginId(login.id);
      if (user) return user;
    }

    const newLogin = await this.prisma.login.create({
      data: {
        email,
        googleId: googleId,
        hashedPassword: 'google' // Usando o nome correto da coluna
      }
    });

    return this.create({
      fullName: name,  // Nome atualizado
      isActive: true,   // Nome atualizado
      loginId: newLogin.id // Nome atualizado
    });
  }

  async create_access_token_for_user(userId: number, token: string): Promise<void> {
    await this.prisma.$executeRaw`INSERT INTO tokens (user_id, token, created_at) VALUES (${userId}, ${token}, NOW())`;
  }

  async get_user_by_email(email: string): Promise<User | null> {
    const login = await this.prisma.login.findUnique({
      where: { email }
    });

    if (!login) return null;

    return this.findByLoginId(login.id);
  }

  async authenticate_user(email: string, password: string): Promise<User | null> {
    const login = await this.prisma.login.findUnique({
      where: { email }
    });

    if (!login) return null;

    return this.findByLoginId(login.id);
  };


  async createRoles(userId: number, roles: string[]): Promise<void> {
    await this.prisma.userRole.createMany({
      data: roles.map(roleId => ({
        userId,
        roleId
      })),
      skipDuplicates: true 
    });
  }


}
