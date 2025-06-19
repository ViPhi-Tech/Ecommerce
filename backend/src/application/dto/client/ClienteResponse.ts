export interface ClientResponse {
    id?: number;
    name?: string | null;
    email: string | null;
    document: string | null;
    phone?: string | null;
    companyId?: number | null;
    isActive?: boolean;
  }