import { IInvoiceRepository } from "../../../domain/repositories/IInvoiceRepository";
import { CreateInvoiceInput } from "../../dto/invoice/CreateInvoiceInput";

export class CreateInvoiceUseCase {
  constructor(private invoiceRepository: IInvoiceRepository) {}

  async execute(data: CreateInvoiceInput) {
    const invoice = await this.invoiceRepository.create({
      ...data,
      series: data.series ?? undefined,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      issueDate: new Date(data.issueDate),
      taxAmount: data.taxAmount ?? undefined,
      clientId: data.clientId ?? undefined,
    });
    return invoice;
  }
}