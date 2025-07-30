import { Stock } from './Stock';

export interface Product {
  id: string | number; // Identificador único do produto
  name: string;
  sku: string;
  category: string;
  brand: string;
  initialPrice: number;
  finalPrice: number;
  quantity: number; // Quantidade em estoque
  stock: Stock;
  shortDescription: string;
  description: string;
  imageUrl: string;

  loading?: boolean; // Indica se o produto está sendo carregado
}
