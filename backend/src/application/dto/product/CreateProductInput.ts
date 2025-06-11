export interface CreateProductInput {
    id?: number
    name: string;
    ean: string;
    initialPrice: number;
    finalPrice: number,
    description?: string | null;
    shortDescription?: string | null;
    image?: string | null;
    sku: string;
    companyId?: number | null;
  }