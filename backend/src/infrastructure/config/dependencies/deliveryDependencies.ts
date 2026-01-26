import { prisma } from "../../database/prismaClient";
import { DeliveryRepository } from "../../database/repositories/DeliveryRepository";
import { CreateDeliveryUseCase } from "../../../application/use-cases/delivery/CreateDeliveryUseCase";
import { FindByUuidDeliveryUseCase } from "../../../application/use-cases/delivery/FindByUuidDeliveryUseCase";
import { FindAllDeliveryUseCase } from "../../../application/use-cases/delivery/FindAllDeliveryUseCase";
import { UpdateDeliveryUseCase } from "../../../application/use-cases/delivery/UpdateDeliveryUseCase";
import { DeleteDeliveryUseCase } from "../../../application/use-cases/delivery/DeleteDeliveryUseCase";
import { CompleteDeliveryUseCase } from "../../../application/use-cases/delivery/CompleteDeliveryUseCase";
import { CancelDeliveryUseCase } from "../../../application/use-cases/delivery/CancelDeliveryUseCase";
import { GetDeliveryDashboardUseCase } from "../../../application/use-cases/delivery/GetDeliveryDashboardUseCase";
import { DeliveryController } from "../../http/controllers/DeliveryController";
import { OrderRepository } from "../../database/repositories/OrderRepository";
import { PrismaTransactionRunner } from "../../database/PrismaTransactionRunner";

const transactionRunner = new PrismaTransactionRunner();

const deliveryRepositoryFactory = (tx: any) => new DeliveryRepository(tx);
const orderRepositoryFactory = (tx: any) => new OrderRepository(tx);

const createDeliveryUseCase = new CreateDeliveryUseCase(
  transactionRunner,
  deliveryRepositoryFactory,
  orderRepositoryFactory
);

export const deliveryRepository = new DeliveryRepository(prisma);

export const findByUuidDeliveryUseCase = new FindByUuidDeliveryUseCase(deliveryRepository);
export const findAllDeliveryUseCase = new FindAllDeliveryUseCase(deliveryRepository);
export const updateDeliveryUseCase = new UpdateDeliveryUseCase(
  transactionRunner,
  deliveryRepositoryFactory,
  orderRepositoryFactory
);
export const deleteDeliveryUseCase = new DeleteDeliveryUseCase(deliveryRepository);
export const completeDeliveryUseCase = new CompleteDeliveryUseCase(deliveryRepository);
export const cancelDeliveryUseCase = new CancelDeliveryUseCase(deliveryRepository);
export const getDeliveryDashboardUseCase = new GetDeliveryDashboardUseCase(deliveryRepository);

// Controller com todos use cases
export const deliveryController = new DeliveryController(
  createDeliveryUseCase,
  findByUuidDeliveryUseCase,
  findAllDeliveryUseCase,
  updateDeliveryUseCase,
  deleteDeliveryUseCase,
  completeDeliveryUseCase,
  cancelDeliveryUseCase,
  getDeliveryDashboardUseCase
);

