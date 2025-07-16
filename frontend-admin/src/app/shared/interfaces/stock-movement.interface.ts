import { BaseModuleState } from 'app/shared/store/base.state';

export interface StockMovementModuleState extends BaseModuleState {
  stockMovementList: StockMovement[];
  cardsData: any; // Dados para exibição em cartões, se necessário
  loadingCards: boolean; // Indica se os dados dos cartões estão sendo carregados
}

export interface StockMovement {
  id?: string;
  productId: string;
  productName: string;
  productSku: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT'; // Entrada, Saída ou Ajuste
  quantity: number;
  previousStock: number;
  currentStock: number;
  reason: string;
  description?: string;
  createdAt: Date;
  createdBy: string;
  referenceId?: string; // ID da venda, compra ou ajuste que originou o movimento
  referenceType?: 'SALE' | 'PURCHASE' | 'ADJUSTMENT' | 'RETURN'; // Tipo da referência

  loading?: boolean; // Indica se o movimento está sendo carregado
}

export interface StockMovementCreate {
  productId: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  reason: string;
  description?: string;
  referenceId?: string;
  referenceType?: 'SALE' | 'PURCHASE' | 'ADJUSTMENT' | 'RETURN';
}
