import { AccountsPayable } from '../entities/AccountsPayable';
import { CreateAccountsPayableInput, UpdateAccountsPayableInput } from '../../application/dto/accountsPayable/AccountsPayableDTOs';

export interface AccountsPayableDueDateRangeFilter {
  dueDateFrom: Date;
  dueDateTo: Date;
}

export interface AccountsPayableListFilter {
  dueDateRange?: AccountsPayableDueDateRangeFilter;
  /** Stored DB status; omit or `all` for no filter. */
  status?: string;
}

export interface IAccountsPayableRepository {
  create(data: CreateAccountsPayableInput): Promise<AccountsPayable>;
  findById(id: number): Promise<AccountsPayable | null>;
  findAll(filter?: AccountsPayableListFilter): Promise<AccountsPayable[]>;
  findBySupplierId(supplierId: number): Promise<AccountsPayable[]>;
  findByStatus(status: string): Promise<AccountsPayable[]>;
  findOverdue(): Promise<AccountsPayable[]>;
  update(id: number, data: UpdateAccountsPayableInput): Promise<AccountsPayable>;
  delete(id: number): Promise<void>;
}