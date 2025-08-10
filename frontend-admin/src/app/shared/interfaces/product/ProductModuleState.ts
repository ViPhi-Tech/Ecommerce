import { BaseModuleState } from 'app/shared/store/base.state';
import { IProduct } from './Product';

export interface ProductModuleState extends BaseModuleState {
  productList: IProduct[];
  filteredProducts: IProduct[]; // Lista de produtos filtrados
  view: 'list' | 'grid'; // Tipo de visualização atual (lista ou grid)
  orderFilter: string; // Filtro atual aplicado à lista de produtos
  searchTerm: string;
}
