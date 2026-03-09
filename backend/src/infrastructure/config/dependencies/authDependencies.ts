import { AuthUseCase } from '../../../application/use-cases/auth/AuthUseCase';
import { SetInitialPasswordUseCase } from '../../../application/use-cases/auth/SetInitialPasswordUseCase';
import { AuthController } from '../../http/controllers/AuthController';
import { JwtAuthService } from '../../services/AuthService';
import { userRepository, loginRepository, passwordService } from './userDependencies';

// Verificar variáveis de ambiente
const JWT_SECRET = process.env.SECRET_KEY || 'seu_jwt_secret_aqui';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || '';

// Services
export const authService = new JwtAuthService(
  JWT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

// Use Cases
export const authUseCase = new AuthUseCase(
  userRepository,
  loginRepository,
  passwordService,
  authService
);

export const setInitialPasswordUseCase = new SetInitialPasswordUseCase(
  loginRepository,
  passwordService
);

// Controllers
export const authController = new AuthController(authUseCase, setInitialPasswordUseCase);