import { IAccountsReceivableRepository } from '../../../domain/repositories/IAccountsReceivableRepository';
import { AccountsReceivable } from '../../../domain/entities/AccountsReceivable';

export class FindAllAccountsReceivableUseCase {
  constructor(private accountsReceivableRepository: IAccountsReceivableRepository) {}

  async execute(): Promise<AccountsReceivable[]> {
    return await this.accountsReceivableRepository.findAll();
  }
}
