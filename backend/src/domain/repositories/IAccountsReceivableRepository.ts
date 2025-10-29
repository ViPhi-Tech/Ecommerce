import { AccountsReceivable } from '../entities/AccountsReceivable';
import {
  CreateAccountsReceivableInput,
  DatesFilter,
  UpdateAccountsReceivableInput
} from '../../application/dto/accountsReceivable/AccountsReceivableDTOs';

export interface IAccountsReceivableRepository {
  create(data: CreateAccountsReceivableInput): Promise<AccountsReceivable>;
  findById(id: number): Promise<AccountsReceivable | null>;
  findAll(data: DatesFilter): Promise<AccountsReceivable[]>;
  findByClientId(clientId: number): Promise<AccountsReceivable[]>;
  findByStatus(status: string): Promise<AccountsReceivable[]>;
  findOverdue(): Promise<AccountsReceivable[]>;
  update(id: number, data: UpdateAccountsReceivableInput): Promise<AccountsReceivable>;
  delete(id: number): Promise<void>;
}
