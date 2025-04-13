import { Login } from './Login';

export interface User {
  id: number;
  loginId: number | null;
  fullName: string | null;  // Permite null
  isActive: boolean;
  companyId: number | null;
}