import { prisma } from "../../database/prismaClient";
import { OrderRepository } from "../../database/repositories/OrderRepository";
import { CreateOrderUseCase } from "../../../application/use-cases/order/CreateOrderUseCase";
import { CreatePreOrderUseCase } from "../../../application/use-cases/order/CreatePreOrderUseCase";
import { FindByIdOrderUseCase } from "../../../application/use-cases/order/FindByIdOrderUseCase";
import { FindAllOrderUseCase } from "../../../application/use-cases/order/FindAllOrderUseCase";
import { UpdateOrderUseCase } from "../../../application/use-cases/order/UpdateOrderUseCase";
import { GetOrderByClientUseCase } from "../../../application/use-cases/order/GetOrderByClientUseCase";

import { OrderController } from "../../http/controllers/OrderController";
import { ProductRepository } from "../../database/repositories/ProductRepository";
import { PrismaTransactionRunner } from "../../database/PrismaTransactionRunner";
import { PaymentRepository } from "../../database/repositories/PaymentRepository";
import { JwtAuthService } from '../../services/AuthService';
const JWT_SECRET = process.env.SECRET_KEY || 'seu_jwt_secret_aqui';

const transactionRunner = new PrismaTransactionRunner();

const orderRepositoryFactory = (tx: any) => new OrderRepository(tx);
const productRepositoryFactory = (tx: any) => new ProductRepository(tx);
const paymentRepositoryFactory = (tx: any) => new PaymentRepository(tx);

const jwtService = new JwtAuthService(JWT_SECRET);

const createOrderUseCase = new CreateOrderUseCase(transactionRunner, orderRepositoryFactory, productRepositoryFactory, paymentRepositoryFactory, jwtService);

export const orderRepository = new OrderRepository(prisma);


export const createPreOrderUseCase = new CreatePreOrderUseCase(orderRepository);

export const findByIdOrderUseCase = new FindByIdOrderUseCase(orderRepository);
export const findAllOrderUseCase = new FindAllOrderUseCase(orderRepository);
export const updateOrderUseCase = new UpdateOrderUseCase(transactionRunner, orderRepositoryFactory, productRepositoryFactory, paymentRepositoryFactory);
export const getOrderByClientUseCase = new GetOrderByClientUseCase(orderRepository);

// Controller com todos use cases
export const orderController = new OrderController(
     createOrderUseCase,
     findByIdOrderUseCase,
     findAllOrderUseCase,
     createPreOrderUseCase,
     updateOrderUseCase,
     getOrderByClientUseCase
);