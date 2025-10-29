import { IAccountsReceivableRepository } from '../../../domain/repositories/IAccountsReceivableRepository';
import { AccountsReceivable } from '../../../domain/entities/AccountsReceivable';
import { CreateAccountsReceivableInput } from '../../dto/accountsReceivable/AccountsReceivableDTOs';
import { parseDate } from '../../../shared/utils/dateUtils';
import { IOrderRepository } from '../../../domain/repositories/IOrderRepository';

export class CreateAccountsReceivableUseCase {
  constructor(private accountsReceivableRepository: IAccountsReceivableRepository, private orderRepository: IOrderRepository) { }

  async execute(data: CreateAccountsReceivableInput): Promise<AccountsReceivable> {
    this.validateDates(data);
    const accountCreated = await this.accountsReceivableRepository.create(data);
    await this.orderRepository.assignOrdersToAccountsReceivable(data.orders, accountCreated.id);
    return accountCreated;
  }

  private validateDates(data: CreateAccountsReceivableInput): void {
    const dates = [
      { field: 'issueDate', value: data.issueDate },
      { field: 'dueDate', value: data.dueDate },
    ];
    for (const dateField of dates) {
      const date = parseDate(dateField.value);
      if (isNaN(date.getTime())) {
        throw new Error(`Data inválida para o campo ${dateField.field}: ${dateField.value}`);
      }
    }
  }
}
