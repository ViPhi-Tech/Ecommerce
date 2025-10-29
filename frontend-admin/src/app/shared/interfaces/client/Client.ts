import { IBillingAddress } from './BillingAddress';

export interface IClient {
  id: string; // Identificador único do cliente
  fullName: string; // Nome completo do cliente
  email: string; // Email do cliente
  phone?: string; // Telefone do cliente (opcional)
  document?: string; // CPF/CNPJ do cliente (opcional)
  documentType?: 'cpf' | 'cnpj'; // Tipo do documento

  // Endereço de Cobrança
  billingAddress?: IBillingAddress; // Endereço de cobrança (opcional)

  // Campos legados (manter por compatibilidade)
  address?: string; // Endereço do cliente (opcional - DEPRECATED)
  city?: string; // Cidade do cliente (opcional - DEPRECATED)
  state?: string; // Estado do cliente (opcional - DEPRECATED)
  zipCode?: string; // CEP do cliente (opcional - DEPRECATED)

  birthDate?: Date; // Data de nascimento (opcional)
  isActive: boolean; // Indica se o cliente está ativo
  createdAt: Date; // Data de criação
  updatedAt: Date; // Data da última atualização
  notes?: string; // Observações sobre o cliente (opcional)
}
