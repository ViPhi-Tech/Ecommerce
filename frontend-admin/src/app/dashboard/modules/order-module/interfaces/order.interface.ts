export interface OrderModuleState {
  orderList: Order[];
  view: 'table' | 'list'; // Tipo de visualização atual (tabela ou lista)
  loading: boolean;
  error: string | null;
}

export interface Order {
  id: string | number; // Identificador único do pedido
  customerName: string; // Nome do cliente
  total: number; // Valor total do pedido
  status: string; // Status do pedido
  createdAt: Date; // Data de criação
  updatedAt: Date; // Data da última atualização
  isActive: boolean; // Indica se o pedido está ativo
  imageUrl?: string; // URL de uma imagem representativa do pedido
  client: Client
}

export interface Client {
    fullName: string;
}