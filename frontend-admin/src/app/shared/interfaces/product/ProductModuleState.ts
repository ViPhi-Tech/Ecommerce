import { BaseModuleState } from 'app/shared/store/base.state';
import { IProduct } from './Product';

export interface ProductModuleState extends BaseModuleState {
  productList: IProduct[];
  filteredProducts: IProduct[]; // Lista de produtos filtrados
  view: 'table' | 'list'; // Tipo de visualização atual (tabela ou lista)
  orderFilter: string; // Filtro atual aplicado à lista de produtos
  searchTerm: string;
}
