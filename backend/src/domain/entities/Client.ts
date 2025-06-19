import { Address } from './Address';

export interface Client {
  id?: number;
  loginId?: number | null;
  fullName: string | null;
  document: string | null;
  email: string | null;
  phone?: string | null;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  address?: Address;
} 