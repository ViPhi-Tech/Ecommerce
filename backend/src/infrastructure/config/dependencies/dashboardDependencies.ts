import { GetDashboardMetricUseCase } from "../../../application/use-cases/dashboard/GetDashboardMetricUseCase";


import { ProductRepository } from "../../database/repositories/ProductRepository";
import { OrderRepository } from "../../database/repositories/OrderRepository";
import { ClientRepository } from "../../database/repositories/ClientRepository";
import { PrismaClient } from "@prisma/client";
import { prisma } from "../../database/prismaClient";
import { DashboardController } from "../../http/controllers/DashboardController";

export const clientRepository = new ClientRepository(prisma);
export const orderRepository = new OrderRepository(prisma);
export const productRepository = new ProductRepository(prisma);

export const getDashboardMetricUseCase = new GetDashboardMetricUseCase(
  productRepository,
  orderRepository,
  clientRepository
);


export const dashboardController = new DashboardController(getDashboardMetricUseCase);
