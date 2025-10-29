import { IOrderRepository } from "../../../domain/repositories/IOrderRepository";

export class AssignOrdersToAccountsReceivableUseCase {
    constructor(
        private orderRepository: IOrderRepository
    ) { }
    async execute(ordersId: number[], accountsReceivableId: number): Promise<void> {
        return await this.orderRepository.assignOrdersToAccountsReceivable(ordersId, accountsReceivableId);
    } 
}