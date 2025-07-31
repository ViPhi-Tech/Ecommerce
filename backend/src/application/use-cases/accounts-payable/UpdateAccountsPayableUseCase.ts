import { IAccountsPayableRepository } from '../../../domain/repositories/IAccountsPayableRepository';
import { AccountsPayable } from '../../../domain/entities/AccountsPayable';
import { AccountsPayableUpdateDTO } from '../../dto/accounts-payable/AccountsPayable.dto';

export class UpdateAccountsPayableUseCase {
  constructor(private accountsPayableRepository: IAccountsPayableRepository) {}

  async execute(id: number, data: AccountsPayableUpdateDTO): Promise<AccountsPayable> {
    const existingAccountsPayable = await this.accountsPayableRepository.findById(id);
    
    if (!existingAccountsPayable) {
      throw new Error('Conta a pagar não encontrada');
    }

    return await this.accountsPayableRepository.update(id, data);
  }
}