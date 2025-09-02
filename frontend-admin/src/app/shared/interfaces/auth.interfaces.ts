export interface AuthResponse {
  status: boolean;
  descricao: string;
  accessToken: string;
  primeiroLogin?: boolean;
}

export interface ChangePasswordRequest {
  email: string;
  novaSenha: string;
  confirmarSenha: string;
}
