import { IAccountsReceivableRepository } from '../../../domain/repositories/IAccountsReceivableRepository';
import { AccountsReceivable } from '../../../domain/entities/AccountsReceivable';

export class FindByClientAccountsReceivableUseCase {
  constructor(private accountsReceivableRepository: IAccountsReceivableRepository) {}

  async execute(clientId: number): Promise<AccountsReceivable[]> {
    return await this.accountsReceivableRepository.findByClientId(clientId);
  }
}
