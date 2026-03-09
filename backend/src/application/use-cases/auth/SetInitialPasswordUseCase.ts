import { ILoginRepository } from '../../../domain/repositories/ILoginRepository';
import { IPasswordService } from '../../../domain/services/IPasswordService';

export class SetInitialPasswordUseCase {
  constructor(
    private loginRepository: ILoginRepository,
    private passwordService: IPasswordService
  ) {}

  async execute(token: string, password: string): Promise<void> {
    const login = await this.loginRepository.findByCreatePasswordToken(token);
    if (!login) {
      throw new Error('Link inválido ou expirado.');
    }
    if (!login.createPasswordTokenExpiresAt || new Date() > login.createPasswordTokenExpiresAt) {
      throw new Error('Link expirado. Solicite um novo e-mail para criar sua senha.');
    }

    const hashedPassword = await this.passwordService.hash(password);
    await this.loginRepository.update(login.id, {
      hashedPassword,
      createPasswordToken: null,
      createPasswordTokenExpiresAt: null
    });
  }
}
