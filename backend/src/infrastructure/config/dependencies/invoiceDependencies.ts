import { prisma } from '../../database/prismaClient';
import { InvoiceRepository } from '../../database/repositories/InvoiceRepository';
import { CreateInvoiceUseCase } from '../../../application/use-cases/invoice/CreateInvoiceUseCase';
import { FindInvoiceByIdUseCase } from '../../../application/use-cases/invoice/FindInvoiceByIdUseCase';
import { FindAllInvoicesUseCase } from '../../../application/use-cases/invoice/FindAllInvoicesUseCase';
import { UpdateInvoiceUseCase } from '../../../application/use-cases/invoice/UpdateInvoiceUseCase';
import { DeleteInvoiceUseCase } from '../../../application/use-cases/invoice/DeleteInvoiceUseCase';
import { InvoiceController } from '../../http/controllers/InvoiceController';

const invoiceRepository = new InvoiceRepository(prisma);

const createInvoiceUseCase = new CreateInvoiceUseCase(invoiceRepository);
const findInvoiceByIdUseCase = new FindInvoiceByIdUseCase(invoiceRepository);
const findAllInvoicesUseCase = new FindAllInvoicesUseCase(invoiceRepository);
const updateInvoiceUseCase = new UpdateInvoiceUseCase(invoiceRepository);
const deleteInvoiceUseCase = new DeleteInvoiceUseCase(invoiceRepository);

export const invoiceController = new InvoiceController(
  createInvoiceUseCase,
  findInvoiceByIdUseCase,
  findAllInvoicesUseCase,
  updateInvoiceUseCase,
  deleteInvoiceUseCase,
);