import { User, UpdateUserDTO } from '../../entities/User';
import { UpdateLoginDTO } from '../../entities/Login';
import { IUserRepository } from '../../repositories/UserRepository';
import { ILoginRepository } from '../../repositories/LoginRepository';
import { PasswordService } from '../../services/PasswordService';
import { UserNotFoundError, EmailAlreadyExistsError } from '../../../shared/errors/UserErrors';

export class UpdateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private loginRepository: ILoginRepository,
    private passwordService: PasswordService
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
        if (existingLogin && existingLogin.id !== user.login_id) {
          throw new EmailAlreadyExistsError();
        }
      }

      // Verificar se o google_id já está em uso por outro login
      if (loginData.google_id) {
        const existingGoogleLogin = await this.loginRepository.findByGoogleId(loginData.google_id);
        if (existingGoogleLogin && existingGoogleLogin.id !== user.login_id) {
          throw new Error('Google ID already in use');
        }
      }

      // Preparar dados de atualização do login
      const loginUpdateData: any = {};
      if (loginData.email) loginUpdateData.email = loginData.email;
      if (loginData.google_id !== undefined) loginUpdateData.google_id = loginData.google_id;
      if (loginData.password) {
        loginUpdateData.hashed_password = await this.passwordService.hash(loginData.password);
      }

      // Atualizar login
      if (Object.keys(loginUpdateData).length > 0) {
        await this.loginRepository.update(user.login_id, loginUpdateData);
      }
    }

    // Atualizar usuário
    return this.userRepository.update(id, userData);
  }
}