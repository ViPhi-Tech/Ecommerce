export interface CreateClientInput {
  fullName: string;
  email: string;
  document: string;
  phone?: string;
  companyId?: number;
  isActive?: boolean;
  // Campos de endereço
  street?: string;
  number?: string;
  neighborhood?: string; // Será mapeado para complement
  zipCode?: string;
  city?: string;
  state?: string;
}

export interface UpdateClientInput {
  fullName?: string;
  email?: string;
  document?: string;
  phone?: string;
  isActive?: boolean;
}