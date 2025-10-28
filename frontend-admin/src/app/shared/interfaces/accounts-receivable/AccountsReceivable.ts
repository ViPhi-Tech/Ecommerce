import { IClient } from '../client/Client';
import { AccountsReceivableStatus } from './AccountsReceivableStatus';

export interface IAccountsReceivable {
  id: number;
  uuid: string;
  clientId?: number;
  client?: IClient;
  issueDate: Date;
  dueDate: Date;
  amount: number;
  recurringIncome: boolean;
  description: string;
  status?: AccountsReceivableStatus; // ex: 'pending', 'received', 'overdue'
  statusLabel?: string; // ex: 'Pendente', 'Recebido', 'Vencido'
  orders?: string[] | number[];
  createdAt: Date;
  updatedAt: Date;
}
