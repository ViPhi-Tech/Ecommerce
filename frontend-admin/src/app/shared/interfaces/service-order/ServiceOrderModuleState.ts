import { BaseModuleState } from 'app/shared/store/base.state';
import { IServiceOrder } from './ServiceOrder';

export interface ServiceOrderModuleState extends BaseModuleState {
  serviceOrderList: IServiceOrder[];
  filteredServiceOrders: IServiceOrder[];
  view: 'list' | 'grid';
  orderFilter: string;
  searchTerm: string;
}
