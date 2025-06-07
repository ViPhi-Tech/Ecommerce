export interface CreateUserInput {
  fullName: string;
  isActive?: boolean;
  email: string;
  googleId?: string;
  password?: string;
}

export interface UpdateUserInput {
  fullName?: string;
  isActive?: boolean;
}
