import { IAccountsPayableRepository } from '../../../domain/repositories/IAccountsPayableRepository';
import { AccountsPayable } from '../../../domain/entities/AccountsPayable';
import { AccountsPayableCreateDTO } from '../../dto/accounts-payable/AccountsPayable.dto';

export class CreateAccountsPayableUseCase {
  constructor(private accountsPayableRepository: IAccountsPayableRepository) {}

  async execute(data: AccountsPayableCreateDTO): Promise<AccountsPayable> {
    return await this.accountsPayableRepository.create(data);
  }
}