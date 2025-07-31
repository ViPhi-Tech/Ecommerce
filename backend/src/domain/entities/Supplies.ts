export interface Supplier {
  id: string;
  tradeName: string;   // Nome fantasia
  legalName: string;   // Razão social
  cnpj: string;
  address: string;
  email?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}