import { BaseModuleState } from 'app/shared/store/base.state';

export interface OrderModuleState extends BaseModuleState {
  orderList: Order[];
  orderDetails: Order; // Detalhes do pedido atual, pode ser null se não houver detalhes carregados
}

export interface Order {
  id: string | number; // Identificador único do pedido
  customerName?: string; // Nome do cliente (opcional para compatibilidade)
  total: number; // Valor total do pedido
  status: string; // Status do pedido
  createdAt: Date | string; // Data de criação
  updatedAt: Date | string; // Data da última atualização
  isActive?: boolean; // Indica se o pedido está ativo (opcional)
  imageUrl?: string; // URL de uma imagem representativa do pedido
  client?: Client; // Cliente (opcional)
  clientId?: number; // ID do cliente
  payments?: Payment[]; // Lista de pagamentos
  items?: OrderItem[]; // Lista de itens do pedido
}

export interface Client {
  fullName: string;
  document: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  birthDate: Date | string;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Payment {
  id: number;
  value: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  orderId: number;
  statusId: string;
  typeId: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  product?: Product;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  sku?: string;
  cost?: number;
  quantity: number;
  ean?: string;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  companyId: number;
  categoryId: number;
  finalPrice: number;
  image?: string;
  initialPrice: number;
  shortDescription?: string;
  brandId?: number;
}
