import { PrismaClient } from '../prismaClient';
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
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: true,
        login: {
          select: {
            email: true,
          }
        }
      }
    });

    if (!user) return null;

    return {
      ...user,
      roles: user.roles.map(r => r.roleId)
    } as User;
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
    return this.prisma.user.findMany({
      where: { isActive: true },
      include: {
        login: {
          select: {
            id: true,
            email: true,
            googleId: true
            // hashedPassword não é incluído
          }
        }
      }
    });
  }

  async findAllWithLogin(): Promise<(User & { login: any })[]> {
    return this.prisma.user.findMany({
      where: {
        isActive: true
      },
      include: {
        login: {
          select: {
            id: true,
            email: true,
            googleId: true
            // hashedPassword não é incluído
          }
        }
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
    await this.prisma.user.update({
      where: { id },
      data: { isActive: false }
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
    try {
      // Verificar se os roles existem antes de criar
      if (!roles || roles.length === 0) {
        console.warn('Nenhum role fornecido para o usuário');
        return;
      }

      await this.prisma.userRole.createMany({
        data: roles.map(roleId => ({
          userId,
          roleId
        })),
        skipDuplicates: true 
      });
    } catch (error: any) {
      console.error('Erro ao criar roles no repositório:', error);
      // Se for erro de foreign key, significa que algum UUID não existe
      if (error?.code === 'P2003') {
        throw new Error(`Um ou mais roles não existem no banco de dados. Verifique os UUIDs: ${roles.join(', ')}`);
      }
      throw error;
    }
  };

  async updateRoles(userId: number, roles: string[]): Promise<void> {
    // Remove todas as roles atuais e recria com a nova lista
    await this.prisma.userRole.deleteMany({
      where: { userId }
    });

    if (!roles || roles.length === 0) {
      return;
    }

    await this.createRoles(userId, roles);
  };

  async getUserRoles(userId: number): Promise<string[]> {
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId },
      select: { roleId: true }
    });
    return userRoles.map(ur => ur.roleId);
  };


}
