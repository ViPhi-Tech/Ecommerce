import { IClient } from '../client/Client';
import { AccountsReceivableStatus } from './AccountsReceivableStatus';

export interface IAccountsReceivable {
  id: number;
  uuid: string;
  clientId?: number;
  client?: IClient;
  originalDueDate: Date;
  issueDate: Date;
  dueDate: Date;
  competenceDate: Date;
  amount: number;
  recurringIncome: boolean;
  description: string;
  status?: AccountsReceivableStatus; // ex: 'pending', 'received', 'overdue'
  statusLabel?: string; // ex: 'Pendente', 'Recebido', 'Vencido'
  createdAt: Date;
  updatedAt: Date;
}
