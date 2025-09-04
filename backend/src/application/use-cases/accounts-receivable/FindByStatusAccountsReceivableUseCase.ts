import { IAccountsReceivableRepository } from '../../../domain/repositories/IAccountsReceivableRepository';
import { AccountsReceivable } from '../../../domain/entities/AccountsReceivable';

export class FindByStatusAccountsReceivableUseCase {
  constructor(private accountsReceivableRepository: IAccountsReceivableRepository) {}

  async execute(status: string): Promise<AccountsReceivable[]> {
    return await this.accountsReceivableRepository.findByStatus(status);
  }
}
