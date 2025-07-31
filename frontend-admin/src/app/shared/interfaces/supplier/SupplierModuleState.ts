import { BaseModuleState } from 'app/shared/store/base.state';
import { ISupplier } from './Supplier';

export interface SupplierModuleState extends BaseModuleState {
  supplierList: ISupplier[];
}
