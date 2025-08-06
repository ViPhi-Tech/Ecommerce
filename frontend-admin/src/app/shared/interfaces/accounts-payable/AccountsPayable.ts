import { ISupplier } from '../supplier/Supplier';

export interface IAccountsPayable {
  id: number;
  uuid: string;
  supplierId?: number;
  supplier?: ISupplier;
  originalDueDate: Date;
  issueDate: Date;
  dueDate: Date;
  competenceDate: Date;
  amount: number;
  recurringPurchase: boolean;
  description: string;
  status: string; // ex: 'pending', 'paid', 'overdue'
  createdAt: Date;
  updatedAt: Date;
}
