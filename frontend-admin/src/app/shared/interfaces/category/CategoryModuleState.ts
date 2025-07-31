import { BaseModuleState } from 'app/shared/store/base.state';
import { ICategory } from './Category';

export interface CategoryModuleState extends BaseModuleState {
  categoryList: ICategory[];
}
