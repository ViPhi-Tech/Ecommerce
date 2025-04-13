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