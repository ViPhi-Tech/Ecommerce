export interface IUser {
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
