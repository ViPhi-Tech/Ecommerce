import { IInvoiceRepository } from "../../../domain/repositories/IInvoiceRepository";
import { CreateInvoiceInput } from "../../dto/invoice/CreateInvoiceInput";

export class UpdateInvoiceUseCase {
  constructor(private invoiceRepository: IInvoiceRepository) {}

  async execute(data: CreateInvoiceInput) {
    if (!data.id) {
      throw new Error('Invoice ID is required for update');
    }
    const invoice = await this.invoiceRepository.update(data.id, {
      ...data,
      series: data.series ?? undefined,
      dueDate: typeof data.dueDate === 'string' ? new Date(data.dueDate) : data.dueDate,
      issueDate: typeof data.issueDate === 'string' ? new Date(data.issueDate) : data.issueDate,
      taxAmount: data.taxAmount ?? undefined,
      clientId: data.clientId ?? undefined,
      orderId: data.orderId ?? undefined,
    });

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    return invoice;
  }
}