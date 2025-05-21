export interface ResellerModuleState {
  resellerList: Reseller[];
  loading: boolean;
  error: string | null;
}

export interface Reseller {
  name: string;
  sku: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  shortDescription: string;
  description: string;
}
