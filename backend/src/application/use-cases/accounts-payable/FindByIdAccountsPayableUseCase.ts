import { IAccountsPayableRepository } from '../../../domain/repositories/IAccountsPayableRepository';
import { AccountsPayable } from '../../../domain/entities/AccountsPayable';

export class FindByIdAccountsPayableUseCase {
  constructor(private accountsPayableRepository: IAccountsPayableRepository) {}

  async execute(id: number): Promise<AccountsPayable | null> {
    return await this.accountsPayableRepository.findById(id);
  }
}