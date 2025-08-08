import { ISupplier } from '../supplier/Supplier';
import { AccountsPayableStatus } from './AccountsPayableStatus';

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
  status?: AccountsPayableStatus; // ex: 'pending', 'paid', 'overdue'
  statusLabel?: string; // ex: 'Pendente', 'Pago', 'Vencido'
  createdAt: Date;
  updatedAt: Date;
}
