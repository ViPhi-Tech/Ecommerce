import { Order } from '../entities/Order';
import { OrderItem } from '../entities/OrderItem';
export interface IOrderRepository {
    create(data: Order): Promise<Order>;
    createItems(saleId: number, items: OrderItem[]): Promise<OrderItem[]>;
    findById(id: number): Promise<Order | null>;
    findAll(): Promise<Order[]>;
    update(id: number, data: Partial<Order>): Promise<Order>;
    delete(id: number): Promise<void>;
}