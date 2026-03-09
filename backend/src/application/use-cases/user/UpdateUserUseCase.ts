import { User } from '../../../domain/entities/User';
import { UpdateUserDTO } from '../../dto/user/UserDTOs';
import { UpdateLoginDTO } from '../../dto/login/LoginDTOs';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ILoginRepository } from '../../../domain/repositories/ILoginRepository';
import { IPasswordService } from '../../../domain/services/IPasswordService';
import { UserNotFoundError, EmailAlreadyExistsError } from '../../../shared/errors/UserErrors';

export class UpdateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private loginRepository: ILoginRepository,
    private passwordService: IPasswordService
  ) {}

  async execute(id: number, userData: UpdateUserDTO, loginData?: UpdateLoginDTO): Promise<User> {
    // Verificar se o usuário existe
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundError();
    }

    // Atualizar login se necessário
    if (loginData) {
      // Verificar se o email já está em uso por outro login
      if (loginData.email) {
        const existingLogin = await this.loginRepository.findByEmail(loginData.email);
        if (existingLogin && existingLogin.id !== user.loginId) {
          throw new EmailAlreadyExistsError();
        }
      }

      if (loginData.googleId) {
        const existingGoogleLogin = await this.loginRepository.findByGoogleId(loginData.googleId);
        if (existingGoogleLogin && existingGoogleLogin.id !== user.loginId) {
          throw new Error('Google ID already in use');
        }
      }

      const loginUpdateData: any = {};
      if (loginData.email) loginUpdateData.email = loginData.email;
      if (loginData.googleId !== undefined) loginUpdateData.googleId = loginData.googleId;
      if (loginData.password) {
        loginUpdateData.hashedPassword = await this.passwordService.hash(loginData.password);
      }

      // Atualizar login
      if (Object.keys(loginUpdateData).length > 0) {
        await this.loginRepository.update(user.loginId ?? 0, loginUpdateData);
      }
    }

    // Atualizar usuário
    return this.userRepository.update(id, userData);
  }
}