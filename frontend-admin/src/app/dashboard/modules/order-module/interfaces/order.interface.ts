import { BaseModuleState } from 'app/shared/store/base.state';

export interface OrderModuleState extends BaseModuleState {
  orderList: Order[];
  orderDetails: Order; // Detalhes do pedido atual, pode ser null se não houver detalhes carregados
  view: 'list' | 'grid'; // Tipo de visualização atual (tabela ou lista)
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
  client: Client;
}

export interface Client {
  fullName: string;
}
