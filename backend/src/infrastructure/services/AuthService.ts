import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { TokenPayload } from '../../domain/entities/Auth';
import { IAuthService } from '../../domain/services/IAuthService';

export class JwtGoogleAuthService implements IAuthService {
  private jwtSecret: string;
  private googleClientId: string;
  private googleClientSecret: string;
  private googleRedirectUri: string;
  private googleClient: OAuth2Client;
  
  constructor(
    jwtSecret: string,
    googleClientId: string,
    googleClientSecret: string,
    googleRedirectUri: string
  ) {
    this.jwtSecret = jwtSecret;
    this.googleClientId = googleClientId;
    this.googleClientSecret = googleClientSecret;
    this.googleRedirectUri = googleRedirectUri;
    this.googleClient = new OAuth2Client(googleClientId, googleClientSecret, googleRedirectUri);
  }

  // Método para gerar token JWT
  generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.jwtSecret, { expiresIn: '1d' });
  }

  // Obter URL de autenticação do Google
  getGoogleAuthUrl(): string {
    return this.googleClient.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ],
      prompt: 'consent'
    });
  }

  // Trocar código de autorização por tokens
  async exchangeCodeForTokens(code: string) {
    const { tokens } = await this.googleClient.getToken(code);
    return tokens;
  }

  // Verificar ID token do Google
  async verifyGoogleIdToken(idToken: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: this.googleClientId
      });
      
      return ticket.getPayload();
    } catch (error) {
      console.error('Erro ao verificar ID token do Google:', error);
      return null;
    }
  }
}