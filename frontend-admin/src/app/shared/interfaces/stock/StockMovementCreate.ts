export interface IStockMovementCreate {
  productId: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  reason: string;
  description?: string;
  referenceId?: string;
  referenceType?: 'SALE' | 'PURCHASE' | 'ADJUSTMENT' | 'RETURN';
}
