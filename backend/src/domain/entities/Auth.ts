export interface TokenPayload {
  sub: number; // user ID
  email: string;
  name: string;
}

export type LoginDTO = {
  email: string;
  password: string;
};

export type GoogleLoginDTO = {
  credential: string;
};

export type AuthResponse = {
  status: boolean;
  descricao: string;
  token?: string;
};