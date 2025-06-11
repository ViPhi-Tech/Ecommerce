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
  companyId?: number | null;
  stock?: {
      quantity: number;
  } | null;  
}