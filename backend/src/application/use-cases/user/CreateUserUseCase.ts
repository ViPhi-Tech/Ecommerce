import { User } from '../../../domain/entities/User';
// import { CreateUserDTO} from "../../../infrastructure/http/dto/User.dto";
import { CreateUserInput } from '../../dto/user/CreateUserInput';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ILoginRepository } from '../../../domain/repositories/ILoginRepository';
import { IPasswordService } from '../../../domain/services/IPasswordService';
import { EmailAlreadyExistsError } from '../../../shared/errors/UserErrors';

export class CreateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private loginRepository: ILoginRepository,
    private passwordService: IPasswordService
  ) {}

  async execute(data: CreateUserInput): Promise<User> {
    // Verificar se já existe um login com o email fornecido
    const existingLogin = await this.loginRepository.findByEmail(data.email);
    if (existingLogin) {
      throw new EmailAlreadyExistsError();
    }

    // Verificar se já existe um login com o google_id fornecido (se houver)
    if (data.googleId) {
      const existingGoogleLogin = await this.loginRepository.findByGoogleId(data.googleId);
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
      googleId: data.googleId,
      hashedPassword: hashed_password || undefined
    });

    // Criar usuário
    return this.userRepository.create({
      fullName: data.fullName,
      isActive: data.isActive ?? true,
      loginId: login.id
    });
  }
}