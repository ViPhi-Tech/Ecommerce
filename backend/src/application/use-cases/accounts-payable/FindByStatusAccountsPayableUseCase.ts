import { IAccountsPayableRepository } from '../../../domain/repositories/IAccountsPayableRepository';
import { AccountsPayable } from '../../../domain/entities/AccountsPayable';

export class FindByStatusAccountsPayableUseCase {
  constructor(private accountsPayableRepository: IAccountsPayableRepository) {}

  async execute(status: string): Promise<AccountsPayable[]> {
    return await this.accountsPayableRepository.findByStatus(status);
  }
}