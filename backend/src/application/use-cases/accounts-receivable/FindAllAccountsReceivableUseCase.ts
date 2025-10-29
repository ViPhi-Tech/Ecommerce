import { IAccountsReceivableRepository } from '../../../domain/repositories/IAccountsReceivableRepository';
import { AccountsReceivable } from '../../../domain/entities/AccountsReceivable';
import {DatesFilter} from "../../dto/accountsReceivable/AccountsReceivableDTOs";

export class FindAllAccountsReceivableUseCase {
  constructor(private accountsReceivableRepository: IAccountsReceivableRepository) {}

  async execute(data: DatesFilter): Promise<AccountsReceivable[]> {
    return await this.accountsReceivableRepository.findAll(data);
  }
}
