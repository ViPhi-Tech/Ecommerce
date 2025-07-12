import { prisma } from "../../database/prismaClient";
import { OrderRepository } from "../../database/repositories/OrderRepository";
import { CreateOrderUseCase } from "../../../application/use-cases/order/CreateOrderUseCase";
import { CreatePreOrderUseCase } from "../../../application/use-cases/order/CreatePreOrderUseCase";
import { FindByIdOrderUseCase } from "../../../application/use-cases/order/FindByIdOrderUseCase";
import { FindAllOrderUseCase } from "../../../application/use-cases/order/FindAllOrderUseCase";
import { UpdateOrderUseCase } from "../../../application/use-cases/order/UpdateOrderUseCase";
import { OrderController } from "../../http/controllers/OrderController";
import { ProductRepository } from "../../database/repositories/ProductRepository";
import { PrismaTransactionRunner } from "../../database/PrismaTransactionRunner";
import { PaymentRepository } from "../../database/repositories/PaymentRepository";
import { JwtAuthService } from '../../services/AuthService';

const JWT_SECRET = process.env.SECRET_KEY || 'seu_jwt_secret_aqui';

const transactionRunner = new PrismaTransactionRunner();

export const orderRepository = new OrderRepository(prisma);
const productRepository = new ProductRepository(prisma);
const paymentRepository = new PaymentRepository(prisma);

const jwtService = new JwtAuthService(JWT_SECRET);
// Use cases com o repository
export const createOrderUseCase = new CreateOrderUseCase(transactionRunner, orderRepository, productRepository, paymentRepository, jwtService);
export const createPreOrderUseCase = new CreatePreOrderUseCase(orderRepository);

export const findByIdOrderUseCase = new FindByIdOrderUseCase(orderRepository);
export const findAllOrderUseCase = new FindAllOrderUseCase(orderRepository);
export const updateOrderUseCase = new UpdateOrderUseCase(transactionRunner, orderRepository, productRepository, paymentRepository);

// Controller com todos use cases
export const orderController = new OrderController(
     createOrderUseCase,
     findByIdOrderUseCase,
     findAllOrderUseCase,
     createPreOrderUseCase,
     updateOrderUseCase
);