export interface OrderModuleState {
  orderList: Order[];
  loading: boolean;
  error: string | null;
}

export interface Order {
  id: string; // Identificador único do pedido
  customerName: string; // Nome do cliente
  totalAmount: number; // Valor total do pedido
  status: 'pending' | 'shipped' | 'delivered'; // Status do pedido
  createdAt: Date; // Data de criação
  updatedAt: Date; // Data da última atualização
  isActive: boolean; // Indica se o pedido está ativo
  imageUrl?: string; // URL de uma imagem representativa do pedido
}
