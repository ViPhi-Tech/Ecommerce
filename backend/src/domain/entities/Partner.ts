import { PartnerType } from '@prisma/client';
import { Address } from './Address';

export interface Partner {
  id: number;
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  document?: string;
  type: PartnerType;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  address?: Address;
}