export interface CreateUserInput {
  fullName: string;
  isActive?: boolean;
  email: string;
  googleId?: string;
  password?: string;
  roles: string[]
}

export interface UpdateUserInput {
  fullName?: string;
  isActive?: boolean;
}
