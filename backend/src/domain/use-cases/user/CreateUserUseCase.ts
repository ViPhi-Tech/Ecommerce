import { User, CreateUserDTO } from '../../entities/User';
import { IUserRepository } from '../../repositories/UserRepository';
import { ILoginRepository } from '../../repositories/LoginRepository';
import { IPasswordService } from '../../services/PasswordService';
import { EmailAlreadyExistsError } from '../../../shared/errors/UserErrors';

export class CreateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private loginRepository: ILoginRepository,
    private passwordService: IPasswordService
  ) {}

  async execute(data: CreateUserDTO): Promise<User> {
    // Verificar se já existe um login com o email fornecido
    const existingLogin = await this.loginRepository.findByEmail(data.email);
    if (existingLogin) {
      throw new EmailAlreadyExistsError();
    }

    // Verificar se já existe um login com o google_id fornecido (se houver)
    if (data.google_id) {
      const existingGoogleLogin = await this.loginRepository.findByGoogleId(data.google_id);
      if (existingGoogleLogin) {
        throw new Error('Google ID already in use');
      }
    }

    // Hash da senha
    const hashed_password = data.password
    ? await this.passwordService.hash(data.password)
    : null;

    // Criar login
    const login = await this.loginRepository.create({
      email: data.email,
      google_id: data.google_id,
      hashed_password: hashed_password || undefined
    });

    // Criar usuário
    return this.userRepository.create({
      full_name: data.full_name,
      is_active: data.is_active ?? true,
      login_id: login.id
    });
  }
}