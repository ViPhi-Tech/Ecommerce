export interface ISupplier {
  id: string; // Identificador único do fornecedor
  name: string; // Nome da empresa fornecedora
  tradeName?: string; // Nome fantasia da empresa
  cnpj?: string; // CNPJ da empresa
  cpf?: string; // CPF (para fornecedores pessoa física)
  email: string; // Email de contato
  phone?: string; // Telefone de contato
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  }; // Endereço completo
  contactPerson?: string; // Pessoa de contato
  description?: string; // Descrição ou observações sobre o fornecedor
  isActive: boolean; // Indica se o fornecedor está ativo
  createdAt: Date; // Data de criação
  updatedAt: Date; // Data da última atualização
}
