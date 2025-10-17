export interface IOrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface IOrderPayment {
  id: number;
  value: number;
  createdAt: string;
  updatedAt: string;
  orderId: number;
  statusId: string;
  typeId: string;
}

export interface IOrderClient {
  id: number;
  fullName: string;
  document: string;
  email: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  loginId: number | null;
  isResetPassword: boolean;
}

export interface IDebt {
  id: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  clientId: number | null;
  items: IOrderItem[];
  client: IOrderClient | null;
  payments: IOrderPayment[];

  // Campos opcionais da estrutura antiga (para compatibilidade)
  title?: string;
  description?: string;
  amount?: number;
  dueDate?: Date | string;
  paidDate?: Date | string;
  creditorName?: string;
  creditorDocument?: string;
  categoryId?: string;
  companyId?: string;
}
