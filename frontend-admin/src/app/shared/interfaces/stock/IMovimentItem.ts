import { Stock } from './Stock';
import { User } from './User';

export interface IMovimentItem {
  id: number;
  stockId: number;
  type: string;
  quantity: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  stock: Stock;
  user: User;

  hour?: string; // Hora do movimento, opcional
  date?: string; // Data do movimento, opcional
}
