import { BaseModuleState } from 'app/shared/store/base.state';

export interface StockMovementModuleState extends BaseModuleState {
  stockMovementList: IMovimentItem[];
  cardsData: any; // Dados para exibição em cartões, se necessário
  loadingCards: boolean; // Indica se os dados dos cartões estão sendo carregados
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

export interface IMovimentItem {
  id: number;
  stockId: number;
  type: string;
  quantity: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  stock: Stock;
  user: User;

  hour?: string; // Hora do movimento, opcional
  date?: string; // Data do movimento, opcional
}

export interface Stock {
  product: Product;
}

export interface Product {
  name: string;
  sku: string;
}

export interface User {
  fullName: string;
}
