import { TokenPayload } from '../entities/Auth';

export interface IAuthService {
  generateToken(payload: TokenPayload): string;
  getGoogleAuthUrl(): string;
  exchangeCodeForTokens(code: string): Promise<any>;
  verifyGoogleIdToken(idToken: string): Promise<any>;
}