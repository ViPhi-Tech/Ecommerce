import { BaseModuleState } from 'app/shared/store/base.state';

export interface ProductModuleState extends BaseModuleState {
  productList: Product[];
  view: 'table' | 'list'; // Tipo de visualização atual (tabela ou lista)
}

export interface Product {
  name: string;
  sku: string;
  category: string;
  brand: string;
  initialPrice: number;
  finalPrice: number;
  stock: number;
  shortDescription: string;
  description: string;
  imageUrl: string;

  loading?: boolean; // Indica se o produto está sendo carregado
}
