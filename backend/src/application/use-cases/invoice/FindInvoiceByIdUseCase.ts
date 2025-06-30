import { IInvoiceRepository } from "../../../domain/repositories/IInvoiceRepository";

export class FindInvoiceByIdUseCase {
  constructor(private invoiceRepository: IInvoiceRepository) {}

  async execute(id: number) {
    const invoice = await this.invoiceRepository.findById(id);
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    return invoice;
  }
}