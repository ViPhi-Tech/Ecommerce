import { BaseModuleState } from 'app/shared/store/base.state';

export interface ProductModuleState extends BaseModuleState {
  productList: Product[];
  view: 'table' | 'list'; // Tipo de visualização atual (tabela ou lista)
  orderFilter: string; // Filtro atual aplicado à lista de produtos
  searchTerm: string;
}

export interface Product {
  name: string;
  sku: string;
  category: string;
  brand: string;
  initialPrice: number;
  finalPrice: number;
  stock: Stock;
  shortDescription: string;
  description: string;
  imageUrl: string;

  loading?: boolean; // Indica se o produto está sendo carregado
}

export interface Stock {
  id: string | number; // Identificador único do estoque
  productId: string | number; // ID do produto associado
  quantity: number; // Quantidade em estoque
  createdAt?: Date; // Data de criação
  updatedAt?: Date; // Data da última atualização
}
