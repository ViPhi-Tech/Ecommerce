export interface CreateProductInput {
    id?: number
    name: string;
    ean: string;
    brand?: string | null;
    initialPrice: number;
    finalPrice: number,
    description?: string | null;
    shortDescription?: string | null;
    image?: string | null;
    sku: string;
    companyId?: number | null;
    categoryId?: number | null;
    quantity?: number;
    user?: number | null;
    icms?: number | null; // Valor unitário do ICMS (editável)
    st?: number | null; // Valor unitário da ST (editável)
  }