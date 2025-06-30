import { IInvoiceRepository } from "../../../domain/repositories/IInvoiceRepository";

export class FindAllInvoicesUseCase {
  constructor(private invoiceRepository: IInvoiceRepository) {}

  async execute() {
    return this.invoiceRepository.findAll();
  }
}