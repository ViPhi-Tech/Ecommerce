export interface TokenPayload {
  userId?: number;  // pode continuar existindo, opcional
  sub: number;      // user ID, obrigatório
  email: string;
  name: string;
  iat?: number;     // issued at (opcional)
  exp?: number;     // expiration (opcional)
}