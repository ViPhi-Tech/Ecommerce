import { OrderResponse } from "../../dto/order/OrderResponse";
import { IOrderRepository } from "../../../domain/repositories/IOrderRepository";

export class FindByIdOrderUseCase {
    constructor(private orderRepository: IOrderRepository) {}

    async execute(id: number): Promise<OrderResponse> {
        const order = await this.orderRepository.findById(id);
        if (!order) {
            throw new Error(`Order with ID ${id} not found`);
        }
        return order;
    }
}