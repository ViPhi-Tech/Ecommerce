export interface ClientModuleState {
  clientList: Client[];
  view: 'table' | 'list'; // Tipo de visualização atual (tabela ou lista)
  loading: boolean;
  error: string | null;
  searchTerm: string; // Termo de busca para filtrar clientes
}

export interface Client {
  id: string | number; // Identificador único do cliente
  fullName: string; // Nome completo do cliente
  email: string; // Email do cliente
  phone?: string; // Telefone do cliente (opcional)
  document?: string; // CPF/CNPJ do cliente (opcional)
  address?: string; // Endereço do cliente (opcional)
  isActive: boolean; // Indica se o cliente está ativo
  createdAt: Date; // Data de criação
  updatedAt: Date; // Data da última atualização
}
