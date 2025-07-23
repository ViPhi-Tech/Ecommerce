import { BaseModuleState } from 'app/shared/store/base.state';
import { Client } from './Client';

export interface ClientModuleState extends BaseModuleState {
  clientList: Client[];
  searchTerm: string; // Campo para armazenar o termo de busca
}
