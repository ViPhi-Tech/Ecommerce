import { BaseModuleState } from 'app/shared/store/base.state';
import { IAccountsPayable } from './AccountsPayable';

export interface AccountsPayableModuleState extends BaseModuleState {
  accountsPayableList: IAccountsPayable[];
}
