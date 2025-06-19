export interface CreateClientInput {
  fullName: string;
  email: string;
  document: string;
  phone?: string;
  companyId?: number;
  isActive?: boolean;
}

export interface UpdateClientInput {
  fullName?: string;
  email?: string;
  document?: string;
  phone?: string;
  isActive?: boolean;
}