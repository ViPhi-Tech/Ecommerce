import { BaseModuleState } from 'app/shared/store/base.state';
import { IMovimentItem } from './IMovimentItem';

export interface StockMovementModuleState extends BaseModuleState {
  stockMovementList: IMovimentItem[];
  cardsData: any; // Dados para exibição em cartões, se necessário
  loadingCards: boolean; // Indica se os dados dos cartões estão sendo carregados
}
