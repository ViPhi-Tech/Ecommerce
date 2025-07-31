import { AccountsPayable } from '../entities/AccountsPayable';
import { AccountsPayableCreateDTO, AccountsPayableUpdateDTO } from '../../application/dto/accounts-payable/AccountsPayable.dto';

export interface IAccountsPayableRepository {
  create(data: AccountsPayableCreateDTO): Promise<AccountsPayable>;
  findById(id: number): Promise<AccountsPayable | null>;
  findAll(): Promise<AccountsPayable[]>;
  findBySupplierId(supplierId: number): Promise<AccountsPayable[]>;
  findByStatus(status: string): Promise<AccountsPayable[]>;
  findOverdue(): Promise<AccountsPayable[]>;
  update(id: number, data: AccountsPayableUpdateDTO): Promise<AccountsPayable>;
  delete(id: number): Promise<void>;
}