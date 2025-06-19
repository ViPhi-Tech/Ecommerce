export interface UpdateStockInput {
    companyId?: number,
    quantity: number,
    productId: number,
    user?: number | null;
    type?: 'IN' | 'OUT';
    operation?: 'ADD' | 'SUBTRACT' | 'SET';
}