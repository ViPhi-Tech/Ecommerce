import { prisma } from '../../database/prismaClient';
import { PurchaseInvoiceRepository } from '../../database/repositories/PurchaseInvoiceRepository';
import { ProductRepository } from '../../database/repositories/ProductRepository';
import { SupplierRepository } from '../../database/repositories/SupplierRepository';
import { CreatePurchaseInvoiceUseCase } from '../../../application/use-cases/purchaseInvoice/CreatePurchaseInvoiceUseCase';
import { PurchaseInvoiceController } from '../../http/controllers/PurchaseInvoiceController';
import { PrismaTransactionRunner } from '../../database/PrismaTransactionRunner';

const purchaseInvoiceRepository = new PurchaseInvoiceRepository(prisma);
const productRepository = new ProductRepository(prisma);
const supplierRepository = new SupplierRepository(prisma);

const transactionRunner = new PrismaTransactionRunner();
const purchaseInvoiceRepositoryFactory = (tx: any) => new PurchaseInvoiceRepository(tx);
const productRepositoryFactory = (tx: any) => new ProductRepository(tx);

const createPurchaseInvoiceUseCase = new CreatePurchaseInvoiceUseCase(
  transactionRunner,
  purchaseInvoiceRepositoryFactory,
  productRepositoryFactory,
  supplierRepository
);

export const purchaseInvoiceController = new PurchaseInvoiceController(
  createPurchaseInvoiceUseCase
);
