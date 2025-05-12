export interface ProductModuleState {
  productList: Product[];
  loading: boolean;
  error: string | null;
}

export interface Product {
  name: string;
  sku: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  shortDescription: string;
  description: string;
}
