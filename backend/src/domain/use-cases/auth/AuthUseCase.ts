import { User } from '../../entities/User';
import { LoginDTO, GoogleLoginDTO, AuthResponse } from '../../entities/Auth';
import { IUserRepository } from '../../repositories/UserRepository';
import { ILoginRepository } from '../../repositories/LoginRepository';
import { IPasswordService } from '../../services/PasswordService';
import { IAuthService } from '../../services/AuthService';
import { InvalidCredentialsError } from '../../../shared/errors/UserErrors';

export class AuthUseCase {
  constructor(
    private userRepository: IUserRepository,
    private loginRepository: ILoginRepository,
    private passwordService: IPasswordService,
    private authService: IAuthService
  ) {}

  // Login tradicional
  async login(data: LoginDTO): Promise<AuthResponse> {
    // Buscar login pelo email
    const login = await this.loginRepository.findByEmail(data.email);
    if (!login) {
      throw new InvalidCredentialsError();
    }

    // Verificar senha
    const isPasswordValid = await this.passwordService.compare(
      data.password,
      login.hashed_password
    );

    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    // Buscar usuário pelo login_id
    const user = await this.userRepository.findByLoginId(login.id);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    // Gerar token JWT
    const token = this.authService.generateToken({
      sub: user.id,
      email: login.email,
      name: user.full_name
    });

    return {
      status: true,
      descricao: 'Login realizado com sucesso!',
      token
    };
  }

  // Obter URL de autenticação do Google
  getGoogleAuthUrl(): string {
    return this.authService.getGoogleAuthUrl();
  }

  // Login com Google usando código de autorização
  async googleLoginWithCode(code: string): Promise<AuthResponse> {
    try {
      // Trocar código por tokens
      const tokens = await this.authService.exchangeCodeForTokens(code);
      
      if (!tokens.id_token) {
        throw new Error('ID token não recebido do Google');
      }
      
      // Verificar ID token
      const payload = await this.authService.verifyGoogleIdToken(tokens.id_token);
      
      if (!payload || !payload.email || !payload.sub) {
        throw new InvalidCredentialsError();
      }
      
      return this.processGoogleUser(payload);
    } catch (error) {
      console.error('Erro no login com Google (código):', error);
      throw new InvalidCredentialsError();
    }
  }

  // Login com Google usando ID token (para login com botão do Google)
  async googleLogin(data: GoogleLoginDTO): Promise<AuthResponse> {
    try {
      // Verificar token do Google
      const payload = await this.authService.verifyGoogleIdToken(data.credential);
      
      if (!payload || !payload.email || !payload.sub) {
        throw new InvalidCredentialsError();
      }
      
      return this.processGoogleUser(payload);
    } catch (error) {
      console.error('Erro no login com Google (ID token):', error);
      throw new InvalidCredentialsError();
    }
  }

  // Processar informações do usuário Google e criar/atualizar usuário
  private async processGoogleUser(payload: any): Promise<AuthResponse> {
    // Verificar se já existe um login com este google_id
    let login = await this.loginRepository.findByGoogleId(payload.sub);
    let user: User | null = null;

    if (login) {
      // Se já existe, buscar o usuário
      user = await this.userRepository.findByLoginId(login.id);
    } else {
      // Se não existe, verificar se existe um login com este email
      login = await this.loginRepository.findByEmail(payload.email);

      if (login) {
        // Se existe login com este email, atualizar o google_id
        login = await this.loginRepository.update(login.id, {
          google_id: payload.sub
        });
        user = await this.userRepository.findByLoginId(login.id);
      } else {
        // Se não existe, criar um novo login e usuário
        // Gerar uma senha aleatória para o usuário (não será usada)
        const randomPassword = Math.random().toString(36).slice(-10);
        const hashedPassword = await this.passwordService.hash(randomPassword);

        // Criar login
        login = await this.loginRepository.create({
          email: payload.email,
          google_id: payload.sub,
          hashed_password: hashedPassword
        });

        // Criar usuário
        user = await this.userRepository.create({
          full_name: payload.name || payload.email.split('@')[0],
          is_active: true,
          login_id: login.id
        });
      }
    }

    if (!user) {
      throw new Error('Falha ao criar ou recuperar usuário');
    }

    // Gerar token JWT
    const token = this.authService.generateToken({
      sub: user.id,
      email: login.email,
      name: user.full_name
    });

    return {
      status: true,
      descricao: 'Login com Google realizado com sucesso!',
      token
    };
  }
}