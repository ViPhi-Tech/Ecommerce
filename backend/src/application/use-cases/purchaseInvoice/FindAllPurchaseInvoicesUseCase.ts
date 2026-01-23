import { IPurchaseInvoiceRepository } from '../../../domain/repositories/IPurchaseInvoiceRepository';
import { PurchaseInvoice } from '../../../domain/entities/PurchaseInvoice';

export class FindAllPurchaseInvoicesUseCase {
  constructor(
    private purchaseInvoiceRepository: IPurchaseInvoiceRepository
  ) {}

  async execute(): Promise<PurchaseInvoice[]> {
    return await this.purchaseInvoiceRepository.findAll();
  }
}
