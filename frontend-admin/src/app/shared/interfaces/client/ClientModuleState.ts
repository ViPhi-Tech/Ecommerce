import { BaseModuleState } from 'app/shared/store/base.state';
import { IClient } from './Client';

export interface ClientModuleState extends BaseModuleState {
  clientList: IClient[];
  searchTerm: string; // Campo para armazenar o termo de busca
}
