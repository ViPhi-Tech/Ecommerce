export interface ProductResponse {
  id?: number;
  name: string;
  ean: string;
  initialPrice: number;
  finalPrice: number;
  image?: string | null;
  description?: string | null;
  shortDescription?: string | null;
  sku: string;
  categoryId?: number | null;
  category?: {
      id: number | null;
      name: string;
  } | null;
  companyId?: number | null;
  icms?: number | null; // Valor unitário do ICMS (editável)
  st?: number | null; // Valor unitário da ST (editável)
  stock?: {
      quantity: number;
  } | null;  
}