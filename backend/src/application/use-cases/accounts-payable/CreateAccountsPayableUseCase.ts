import { IAccountsPayableRepository } from '../../../domain/repositories/IAccountsPayableRepository';
import { AccountsPayable } from '../../../domain/entities/AccountsPayable';
import { CreateAccountsPayableInput } from '../../dto/accountsPayable/AccountsPayableDTOs';
import { parseDate } from '../../../shared/utils/dateUtils';

export class CreateAccountsPayableUseCase {
  constructor(private accountsPayableRepository: IAccountsPayableRepository) { }

  async execute(data: CreateAccountsPayableInput): Promise<AccountsPayable> {
    // Validar se as datas são válidas
    this.validateDates(data);

    return await this.accountsPayableRepository.create(data);
  }

  private validateDates(data: CreateAccountsPayableInput): void {
    const dates = [
      // { field: 'originalDueDate', value: data.originalDueDate },
      { field: 'issueDate', value: data.issueDate },
      { field: 'dueDate', value: data.dueDate },
      // { field: 'competenceDate', value: data.competenceDate }
    ];

    for (const dateField of dates) {
      if (dateField.value === undefined || dateField.value === null) {
        throw new Error(`Campo de data ausente para ${dateField.field}`);
      }

      const date = parseDate(String(dateField.value));
      if (isNaN(date.getTime())) {
        throw new Error(`Data inválida para o campo ${dateField.field}: ${dateField.value}`);
      }
    }
  }
}