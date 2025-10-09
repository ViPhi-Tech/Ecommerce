import { IDebt } from './Debt';

export interface DebtModuleState {
  debtList: IDebt[];
  loading: boolean;
  error: string | null;
}
