import {
  AccountsPayableListFilter,
  IAccountsPayableRepository,
} from '../../../domain/repositories/IAccountsPayableRepository';
import { AccountsPayable } from '../../../domain/entities/AccountsPayable';

export class FindAllAccountsPayableUseCase {
  constructor(private accountsPayableRepository: IAccountsPayableRepository) {}

  async execute(filter?: AccountsPayableListFilter): Promise<AccountsPayable[]> {
    return await this.accountsPayableRepository.findAll(filter);
  }
}