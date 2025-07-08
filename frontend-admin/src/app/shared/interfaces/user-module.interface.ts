import { BaseModuleState } from 'app/shared/store/base.state';

export interface UserModuleState extends BaseModuleState {
  userList: User[];
  view: 'table' | 'list'; // Tipo de visualização atual (tabela ou lista)
  searchTerm: string; // Termo de busca para filtrar usuários
}

export interface User {
  id: string | number; // Identificador único do usuário
  fullName: string; // Nome completo do usuário
  email: string; // Email do usuário
  loginId?: number; // ID do login associado
  isActive: boolean; // Indica se o usuário está ativo
  createdAt?: Date; // Data de criação
  updatedAt?: Date; // Data da última atualização
  companyId?: number; // ID da empresa associada

  loading?: boolean; // Indica se o usuário está sendo carregado
}

export interface UserCreate {
  id?: string | number; // ID opcional para criação (geralmente não é necessário)
  fullName: string;
  email: string;
  password?: string;
  isActive?: boolean;
}

export interface UserUpdate {
  id: string | number; // ID do usuário a ser atualizado
  fullName?: string;
  email?: string;
  password?: string;
  isActive?: boolean;
}
