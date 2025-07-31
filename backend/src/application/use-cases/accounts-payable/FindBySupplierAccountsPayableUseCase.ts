import { IAccountsPayableRepository } from '../../../domain/repositories/IAccountsPayableRepository';
import { AccountsPayable } from '../../../domain/entities/AccountsPayable';

export class FindBySupplierAccountsPayableUseCase {
  constructor(private accountsPayableRepository: IAccountsPayableRepository) {}

  async execute(supplierId: number): Promise<AccountsPayable[]> {
    return await this.accountsPayableRepository.findBySupplierId(supplierId);
  }
}