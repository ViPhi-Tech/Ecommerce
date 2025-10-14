import { IAccountsPayableRepository } from '../../../domain/repositories/IAccountsPayableRepository';
import { AccountsPayable } from '../../../domain/entities/AccountsPayable';
import { UpdateAccountsPayableInput } from '../../dto/accountsPayable/AccountsPayableDTOs';
import { parseDate } from '../../../shared/utils/dateUtils';

export class UpdateAccountsPayableUseCase {
  constructor(private accountsPayableRepository: IAccountsPayableRepository) { }

  async execute(id: number, data: UpdateAccountsPayableInput): Promise<AccountsPayable> {
    const existingAccountsPayable = await this.accountsPayableRepository.findById(id);

    if (!existingAccountsPayable) {
      throw new Error('Conta a pagar não encontrada');
    }

    // Validar datas se fornecidas
    this.validateDates(data);

    return await this.accountsPayableRepository.update(id, data);
  }

  private validateDates(data: UpdateAccountsPayableInput): void {
    const dateFields = [
      // { field: 'originalDueDate', value: data.originalDueDate },
      { field: 'issueDate', value: data.issueDate },
      { field: 'dueDate', value: data.dueDate },
      // { field: 'competenceDate', value: data.competenceDate }
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