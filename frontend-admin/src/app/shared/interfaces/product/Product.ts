import { IStock } from '../stock/Stock';

export interface IProduct {
  id: string | number; // Identificador único do produto
  name: string;
  sku: string;
  ean: string;
  category: string;
  brand: string;
  initialPrice: number;
  finalPrice: number;
  icms?: number | null; // Valor unitário do ICMS (editável)
  st?: number | null; // Valor unitário da ST (editável)
  quantity: number; // Quantidade em estoque
  stock: IStock;
  shortDescription: string;
  description: string;
  imageUrl: string;

  loading?: boolean; // Indica se o produto está sendo carregado
}
