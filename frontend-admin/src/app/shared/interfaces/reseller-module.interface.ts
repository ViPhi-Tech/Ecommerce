export interface Reseller {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  status?: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface ResellerModuleState {
  resellerList: Reseller[];
  loading: boolean;
  error: string | null;
}
