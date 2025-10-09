import { IOrderRepository } from "../../../domain/repositories/IOrderRepository";
import { OrderResponse } from "../../dto/order/OrderResponse";
import { GetOrders } from "../../dto/order/GetOrders";
export class GetOrderByClientUseCase {
    constructor(private orderRepository: IOrderRepository) {}
  
    async execute(data: GetOrders): Promise<OrderResponse[]> {
        const orders = await this.orderRepository.getOrdersByClient(data.clientId as number, data.startDate, data.endDate, data.paymentTypeId || '');
        return orders;
    }
}