export type CreateLoginDTO = {
    email: string;
    googleId?: string;
    hashedPassword?: string | null;
  };
  
  export type UpdateLoginDTO = Partial<{
    email: string;
    googleId?: string;
    password: string;
  }>;