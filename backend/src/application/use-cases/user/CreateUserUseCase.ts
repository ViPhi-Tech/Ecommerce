import { randomUUID } from 'crypto';
import { User } from '../../../domain/entities/User';
import { CreateUserInput } from '../../dto/user/CreateUserInput';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ILoginRepository } from '../../../domain/repositories/ILoginRepository';
import { IEmailService } from '../../../domain/services/IEmailService';
import { EmailAlreadyExistsError } from '../../../shared/errors/UserErrors';

const TOKEN_EXPIRY_HOURS = 24;

export class CreateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private loginRepository: ILoginRepository,
    private emailService: IEmailService
  ) {}

  async execute(data: CreateUserInput): Promise<User> {
    const existingLogin = await this.loginRepository.findByEmail(data.email);
    if (existingLogin) {
      throw new EmailAlreadyExistsError();
    }

    if (data.googleId) {
      const existingGoogleLogin = await this.loginRepository.findByGoogleId(data.googleId);
      if (existingGoogleLogin) {
        throw new Error('Google ID already in use');
      }
    }

    const token = randomUUID();
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

    const login = await this.loginRepository.create({
      email: data.email,
      googleId: data.googleId,
      hashedPassword: null
    });

    await this.loginRepository.update(login.id, {
      createPasswordToken: token,
      createPasswordTokenExpiresAt: expiresAt
    });

    const user = await this.userRepository.create({
      fullName: data.fullName,
      isActive: data.isActive ?? true,
      loginId: login.id
    });

    try {
      await this.userRepository.createRoles(user.id, data.roles);
    } catch (error: any) {
      console.error('Erro ao criar roles:', error);
      throw new Error(`Erro ao associar roles ao usuário: ${error?.message || 'Erro desconhecido'}`);
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
    const createPasswordUrl = `${frontendUrl.replace(/\/$/, '')}/create-password?token=${token}`;

    await this.emailService.sendCreatePasswordEmail(data.email, {
      createPasswordUrl,
      fullName: data.fullName?.trim() || 'usuário',
      expiryHours: '24'
    });

    return user;
  }
}