import { BaseModuleState } from 'app/shared/store/base.state';

export interface ProductModuleState extends BaseModuleState {
  productList: Product[];
  filteredProducts: Product[]; // Lista de produtos filtrados
  view: 'table' | 'list'; // Tipo de visualização atual (tabela ou lista)
  orderFilter: string; // Filtro atual aplicado à lista de produtos
  searchTerm: string;
}

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

export interface Stock {
  id: string | number; // Identificador único do estoque
  productId: string | number; // ID do produto associado
  quantity: number; // Quantidade em estoque
  createdAt?: Date; // Data de criação
  updatedAt?: Date; // Data da última atualização
}
