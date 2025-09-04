import { IAccountsReceivableRepository } from '../../../domain/repositories/IAccountsReceivableRepository';

export class DeleteAccountsReceivableUseCase {
  constructor(private accountsReceivableRepository: IAccountsReceivableRepository) {}

  async execute(id: number): Promise<void> {
    const existingAccountsReceivable = await this.accountsReceivableRepository.findById(id);
    if (!existingAccountsReceivable) {
      throw new Error('Conta a receber não encontrada');
    }
    await this.accountsReceivableRepository.delete(id);
  }
}
