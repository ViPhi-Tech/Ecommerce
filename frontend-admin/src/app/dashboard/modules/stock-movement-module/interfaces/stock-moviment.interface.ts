export interface MovimentManyStocks {
  type: 'IN' | 'OUT';
  stocks: {
    productId: string | number;
    quantity: number;
    unitCost?: number | null;
    invoiceNumber?: string | null;
    icms?: number | null;
    st?: number | null;
  }[];
}
