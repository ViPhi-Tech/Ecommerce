import { IAccountsPayableRepository } from '../../../domain/repositories/IAccountsPayableRepository';
import { AccountsPayable } from '../../../domain/entities/AccountsPayable';

export class FindOverdueAccountsPayableUseCase {
  constructor(private accountsPayableRepository: IAccountsPayableRepository) {}

  async execute(): Promise<AccountsPayable[]> {
    return await this.accountsPayableRepository.findOverdue();
  }
}