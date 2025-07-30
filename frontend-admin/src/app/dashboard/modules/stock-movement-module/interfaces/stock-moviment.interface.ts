export interface MovimentManyStocks {
  type: 'IN' | 'OUT';
  stocks: {
    productId: string | number;
    quantity: number;
  }[];
}
