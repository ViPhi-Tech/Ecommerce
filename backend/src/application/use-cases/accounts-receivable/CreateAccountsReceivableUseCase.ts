import { IAccountsReceivableRepository } from '../../../domain/repositories/IAccountsReceivableRepository';
import { AccountsReceivable } from '../../../domain/entities/AccountsReceivable';
import { CreateAccountsReceivableInput } from '../../dto/accountsReceivable/AccountsReceivableDTOs';
import { parseDate } from '../../../shared/utils/dateUtils';

export class CreateAccountsReceivableUseCase {
  constructor(private accountsReceivableRepository: IAccountsReceivableRepository) { }

  async execute(data: CreateAccountsReceivableInput): Promise<AccountsReceivable> {
    this.validateDates(data);
    return await this.accountsReceivableRepository.create(data);
  }

  private validateDates(data: CreateAccountsReceivableInput): void {
    const dates = [
      { field: 'originalDueDate', value: data.originalDueDate },
      { field: 'issueDate', value: data.issueDate },
      { field: 'dueDate', value: data.dueDate },
      { field: 'competenceDate', value: data.competenceDate }
    ];
    for (const dateField of dates) {
      const date = parseDate(dateField.value);
      if (isNaN(date.getTime())) {
        throw new Error(`Data inválida para o campo ${dateField.field}: ${dateField.value}`);
      }
    }
  }
}
