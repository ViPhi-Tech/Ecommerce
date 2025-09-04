import { IAccountsReceivableRepository } from '../../../domain/repositories/IAccountsReceivableRepository';
import { AccountsReceivable } from '../../../domain/entities/AccountsReceivable';
import { UpdateAccountsReceivableInput } from '../../dto/accountsReceivable/AccountsReceivableDTOs';
import { parseDate } from '../../../shared/utils/dateUtils';

export class UpdateAccountsReceivableUseCase {
  constructor(private accountsReceivableRepository: IAccountsReceivableRepository) { }

  async execute(id: number, data: UpdateAccountsReceivableInput): Promise<AccountsReceivable> {
    const existingAccountsReceivable = await this.accountsReceivableRepository.findById(id);
    if (!existingAccountsReceivable) {
      throw new Error('Conta a receber não encontrada');
    }
    this.validateDates(data);
    return await this.accountsReceivableRepository.update(id, data);
  }

  private validateDates(data: UpdateAccountsReceivableInput): void {
    const dateFields = [
      { field: 'originalDueDate', value: data.originalDueDate },
      { field: 'issueDate', value: data.issueDate },
      { field: 'dueDate', value: data.dueDate },
      { field: 'competenceDate', value: data.competenceDate }
    ];
    for (const dateField of dateFields) {
      if (dateField.value !== undefined) {
        const date = parseDate(dateField.value);
        if (isNaN(date.getTime())) {
          throw new Error(`Data inválida para o campo ${dateField.field}: ${dateField.value}`);
        }
      }
    }
  }
}
