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

  hour?: string; // Hora do movimento, opcional
  date?: string; // Data do movimento, opcional
}
