import { BaseModuleState } from 'app/shared/store/base.state';
import { IProduct } from './Product';

export interface ProductModuleState extends BaseModuleState {
  productList: IProduct[];
  filteredProducts: IProduct[]; // Lista de produtos filtrados
  orderFilter: string; // Filtro atual aplicado à lista de produtos
  searchTerm: string;
}
