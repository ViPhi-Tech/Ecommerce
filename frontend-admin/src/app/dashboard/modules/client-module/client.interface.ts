import { BaseModuleState } from "app/shared/store/base.state";

export interface ClientModuleState extends BaseModuleState {
  clientList: Client[];
  searchTerm: string; // Campo para armazenar o termo de busca
}

export interface Client {
  id: string; // Identificador único do cliente
  fullName: string; // Nome completo do cliente
  email: string; // Email do cliente
  phone?: string; // Telefone do cliente (opcional)
  document?: string; // CPF/CNPJ do cliente (opcional)
  address?: string; // Endereço do cliente (opcional)
  city?: string; // Cidade do cliente (opcional)
  state?: string; // Estado do cliente (opcional)
  zipCode?: string; // CEP do cliente (opcional)
  birthDate?: Date; // Data de nascimento (opcional)
  isActive: boolean; // Indica se o cliente está ativo
  createdAt: Date; // Data de criação
  updatedAt: Date; // Data da última atualização
  notes?: string; // Observações sobre o cliente (opcional)
}
