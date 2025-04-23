export type CreateUserDTO = {
    fullName: string;
    isActive?: boolean;
    email: string;
    googleId?: string;
    password?: string;
  };
  
  export type UpdateUserDTO = Partial<{
    fullName: string;
    isActive: boolean;
  }>;