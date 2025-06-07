import { prisma } from "../../database/prismaClient";
import { OrderRepository } from "../../database/repositories/OrderRepository";
import { CreateOrderUseCase } from "../../../application/use-cases/order/CreateOrderUseCase";
import { OrderController } from "../../http/controllers/OrderController";

// repository com o prism

export const orderRepository = new OrderRepository(prisma);

// Use cases com o repository
export const createOrderUseCase = new CreateOrderUseCase(orderRepository);

// Controller com todos use cases
export const orderController = new OrderController(createOrderUseCase);