import { IAccountsReceivableRepository } from '../../../domain/repositories/IAccountsReceivableRepository';
import { AccountsReceivable } from '../../../domain/entities/AccountsReceivable';

export class FindByIdAccountsReceivableUseCase {
  constructor(private accountsReceivableRepository: IAccountsReceivableRepository) {}

  async execute(id: number): Promise<AccountsReceivable | null> {
    return await this.accountsReceivableRepository.findById(id);
  }
}
