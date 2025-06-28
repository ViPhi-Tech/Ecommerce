import { prisma } from "../../database/prismaClient";
import { OrderRepository } from "../../database/repositories/OrderRepository";
import { CreateOrderUseCase } from "../../../application/use-cases/order/CreateOrderUseCase";
import { FindByIdOrderUseCase } from "../../../application/use-cases/order/FindByIdOrderUseCase";
import { FindAllOrderUseCase } from "../../../application/use-cases/order/FindAllOrderUseCase";
import { OrderController } from "../../http/controllers/OrderController";
import { ProductRepository } from "../../database/repositories/ProductRepository";
import { PrismaTransactionRunner } from "../../database/PrismaTransactionRunner";


const transactionRunner = new PrismaTransactionRunner();

export const orderRepository = new OrderRepository(prisma);
const productRepository = new ProductRepository(prisma);
// Use cases com o repository
export const createOrderUseCase = new CreateOrderUseCase(transactionRunner, orderRepository, productRepository);

export const findByIdOrderUseCase = new FindByIdOrderUseCase(orderRepository);
export const findAllOrderUseCase = new FindAllOrderUseCase(orderRepository);

// Controller com todos use cases
export const orderController = new OrderController(
     createOrderUseCase,
     findByIdOrderUseCase,
     findAllOrderUseCase
);