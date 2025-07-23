import { IInvoiceRepository } from "../../../domain/repositories/IInvoiceRepository";
import { CreateInvoiceInput } from "../../dto/invoice/CreateInvoiceInput";
import { ITransactionRunner } from "../../../domain/repositories/ITransactionRunner";
import { ITransactionClient } from "../../../domain/repositories/ITransactionClient";
import { Invoice } from "../../../domain/entities/Invoice";

type InvoiceRepositoryFactory = (tx: ITransactionClient) => IInvoiceRepository;

export class CreateInvoiceUseCase {
  constructor(    
    private transactionRunner: ITransactionRunner,
    private invoiceRepositoryFactory: InvoiceRepositoryFactory
  ) {}

  async execute(data: CreateInvoiceInput): Promise<Invoice> {
    return this.transactionRunner.run(async (tx) => {
      const invoiceRepository = this.invoiceRepositoryFactory(tx);

      const { items, ...invoiceData } = data;

      const invoice = await invoiceRepository.create({
        ...invoiceData,
        dueDate: invoiceData.dueDate ? new Date(invoiceData.dueDate) : undefined,
        issueDate: new Date(invoiceData.issueDate),
      });

      if (invoice.id && items && items.length > 0) {
        const currentInvoiceId = invoice.id;
        const itemsToCreate = items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          totalAmount: item.totalAmount, 
          invoiceId: currentInvoiceId
        }));
        await invoiceRepository.createItems(invoice.id, itemsToCreate);
        const itemsInvoice = await invoiceRepository.findItemsByInvoiceID(currentInvoiceId)
        invoice.items = itemsInvoice
      }
      return invoice;
    });
  }
}