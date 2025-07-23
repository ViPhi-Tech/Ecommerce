import { BaseModuleState } from 'app/shared/store/base.state';
import { User } from './User';

export interface UserModuleState extends BaseModuleState {
  userList: User[];
  view: 'table' | 'list'; // Tipo de visualização atual (tabela ou lista)
  searchTerm: string; // Termo de busca para filtrar usuários
}
