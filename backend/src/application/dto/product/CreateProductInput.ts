export interface CreateProductInput {
    name: string;
    ean: string;
    price: number;
    sku: string;
    companyId?: number | null;
  }