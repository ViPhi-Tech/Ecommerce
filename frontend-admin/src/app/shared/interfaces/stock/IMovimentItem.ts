import { ButtonSeverityType } from 'app/shared/types/button.types';
import { IStock } from './Stock';
import { IUser } from './User';

export interface IMovimentItem {
  id: number;
  stockId: number;
  type: string;
  quantity: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  stock: IStock;
  user: IUser;

  typeBadge?: ButtonSeverityType;
  typeLabel?: string;

  productName?: string;
  productSku?: string;

  hour?: string; // Hora do movimento, opcional
  date?: string; // Data do movimento, opcional
}
