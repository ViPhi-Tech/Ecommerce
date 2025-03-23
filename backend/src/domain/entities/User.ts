import { Login } from './Login';

export interface User {
  id: number;
  full_name: string;
  is_active: boolean;
  login_id: number;
  login?: Login;
}

export type CreateUserDTO = {
  full_name: string;
  is_active?: boolean;
  email: string;
  google_id?: string;
  password?: string;
};

export type UpdateUserDTO = Partial<{
  full_name: string;
  is_active: boolean;
}>;