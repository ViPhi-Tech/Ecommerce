import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { TokenPayload } from '../../domain/entities/Auth';
import { IAuthService } from '../../domain/services/IAuthService';

export class JwtAuthService implements IAuthService {
  private jwtSecret: string;
  private googleClientId: string;
  private googleClientSecret: string;
  private googleRedirectUri: string;
  private googleClient: OAuth2Client;
  
  constructor(
  jwtSecret: string,
  googleClientId?: string,
  googleClientSecret?: string,
  googleRedirectUri?: string
) {
  this.jwtSecret = jwtSecret;
  this.googleClientId = googleClientId ?? '';
  this.googleClientSecret = googleClientSecret ?? '';
  this.googleRedirectUri = googleRedirectUri ?? '';

  this.googleClient = new OAuth2Client(googleClientId, googleClientSecret, googleRedirectUri);

}

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

  verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, this.jwtSecret) as unknown;

    if (
      typeof decoded === 'object' &&
      decoded !== null &&
      'sub' in decoded && typeof (decoded as any).sub === 'number' &&
      'email' in decoded && typeof (decoded as any).email === 'string' &&
      'name' in decoded && typeof (decoded as any).name === 'string'
    ) {
      return {
        sub: parseInt((decoded as any).sub, 10),
        email: (decoded as any).email,
        name: (decoded as any).name,
        iat: (decoded as any).iat,
        exp: (decoded as any).exp,
      };
    }

    return null;
  } catch (error) {
    console.error('Token inválido:', error);
    return null;
  }
}

getLoggedInUserId(token: string): number | null {
  const decodedToken = this.verifyToken(token); 

  if (decodedToken && decodedToken.sub) {
    return decodedToken.sub;
  }

  return null;
}
  async exchangeCodeForTokens(code: string) {
    const { tokens } = await this.googleClient.getToken(code);
    return tokens;
  }

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