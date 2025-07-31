import { IAccountsPayableRepository } from '../../../domain/repositories/IAccountsPayableRepository';

export class DeleteAccountsPayableUseCase {
  constructor(private accountsPayableRepository: IAccountsPayableRepository) {}

  async execute(id: number): Promise<void> {
    const existingAccountsPayable = await this.accountsPayableRepository.findById(id);
    
    if (!existingAccountsPayable) {
      throw new Error('Conta a pagar não encontrada');
    }

    await this.accountsPayableRepository.delete(id);
  }
}