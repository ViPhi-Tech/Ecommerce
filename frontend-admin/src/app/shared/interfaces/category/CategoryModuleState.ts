import { BaseModuleState } from 'app/shared/store/base.state';
import { Category } from './Category';

export interface CategoryModuleState extends BaseModuleState {
  categoryList: Category[];
}
