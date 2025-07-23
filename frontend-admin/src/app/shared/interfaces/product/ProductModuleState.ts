import { BaseModuleState } from 'app/shared/store/base.state';
import { Product } from './Product';

export interface ProductModuleState extends BaseModuleState {
  productList: Product[];
  filteredProducts: Product[]; // Lista de produtos filtrados
  view: 'table' | 'list'; // Tipo de visualização atual (tabela ou lista)
  orderFilter: string; // Filtro atual aplicado à lista de produtos
  searchTerm: string;
}
