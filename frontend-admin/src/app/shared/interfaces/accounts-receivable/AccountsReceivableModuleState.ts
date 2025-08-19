import { BaseModuleState } from 'app/shared/store/base.state';
import { IAccountsReceivable } from './AccountsReceivable';

export interface AccountsReceivableModuleState extends BaseModuleState {
  accountsReceivableList: IAccountsReceivable[];
}
