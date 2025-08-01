export interface ISupplier {
  id: number; // Identificador único autoincremental
  uuid: string; // UUID único
  tradeName: string; // Nome fantasia
  legalName: string; // Razão social
  cnpj: string; // CNPJ da empresa (obrigatório e único)
  address: string; // Endereço completo
  email?: string; // Email de contato (opcional)
  phone?: string; // Telefone de contato (opcional)
  createdAt: Date; // Data de criação
  updatedAt: Date; // Data da última atualização
  accountsPayable?: any[]; // Relacionamento com contas a pagar
}
