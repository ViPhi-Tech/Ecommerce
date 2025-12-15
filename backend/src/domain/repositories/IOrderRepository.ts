import { Order } from '../entities/Order';
import { OrderItem, AggregateOrderResponse, AggregateOrderStatusResponse, AggregateOrderCategoryResponse } from '../entities/OrderItem';

export interface IOrderRepository {
    create(data: Order): Promise<Order>;
    createItems(saleId: number, items: OrderItem[]): Promise<OrderItem[]>;  
    findById(id: number): Promise<Order | null>;
    findAll(): Promise<Order[]>;
    update(id: number, data: Partial<Order>): Promise<Order>;
    delete(id: number): Promise<void>;
    createPreOrder(clientId: number): Promise<Order>;
    countByMonth(initialMonth: number, finalMonth: number): Promise<number>;
    countSalesByMonth(initialMonth: number, finalMonth: number): Promise<number>;
    aggregateSalesByMonth(initialMonth: number, finalMonth: number): Promise<AggregateOrderResponse[]>;
    aggregateSalesByStatus(initialMonth: number, finalMonth: number): Promise<AggregateOrderStatusResponse[]>;
    aggregateSalesByCategory(initialMonth: number, finalMonth: number): Promise<AggregateOrderCategoryResponse[]>;
    getOrdersByClient(clientId: number, startDate: string, endDate: string, paymentTypeId: string): Promise<Order[]>;
    assignOrdersToAccountsReceivable(orders: number[], accountsReceivableId: number): Promise<void>;
    assignOrdersToDelivery(orderIds: number[], deliveryId: number): Promise<void>;
    removeDeliveryFromOrders(orderIds: number[]): Promise<void>;
    validateIds(ids: number[]): Promise<number[]>;
}