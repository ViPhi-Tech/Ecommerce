import { AuthUseCase } from '../../../application/use-cases/auth/AuthUseCase';
import { AuthController } from '../../http/controllers/AuthController';
import { JwtGoogleAuthService } from '../../services/AuthService';
import { userRepository, loginRepository, passwordService } from './userDependencies';

// Verificar variáveis de ambiente
const JWT_SECRET = process.env.JWT_SECRET || 'seu_jwt_secret_aqui';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || '';

// Services
export const authService = new JwtGoogleAuthService(
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

// Controllers
export const authController = new AuthController(authUseCase);