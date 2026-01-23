import { IPurchaseInvoiceRepository } from '../../../domain/repositories/IPurchaseInvoiceRepository';
import { PurchaseInvoice } from '../../../domain/entities/PurchaseInvoice';

export class FindPurchaseInvoiceByIdUseCase {
  constructor(
    private purchaseInvoiceRepository: IPurchaseInvoiceRepository
  ) {}

  async execute(id: number): Promise<PurchaseInvoice> {
    const invoice = await this.purchaseInvoiceRepository.findById(id);
    
    if (!invoice) {
      throw new Error('Nota fiscal não encontrada');
    }

    return invoice;
  }
}
