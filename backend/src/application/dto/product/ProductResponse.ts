export interface ProductResponse {
    name: string;
    ean: string;
    price: number;
    sku: string;
    companyId?: number | null;
  }