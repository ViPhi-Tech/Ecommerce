export interface CreateProductInput {
    id?: number
    name: string;
    ean: string;
    price: number;
    sku: string;
    companyId?: number | null;
  }