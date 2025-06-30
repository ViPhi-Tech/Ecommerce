import { IInvoiceRepository } from '../../../domain/repositories/IInvoiceRepository';

export class DeleteInvoiceUseCase {
  constructor(private invoiceRepository: IInvoiceRepository) {}

  async execute(id: number): Promise<void> {
    try {
      await this.invoiceRepository.delete(id);
    } catch (error: any) {
      console.error('Error deleting invoice:', error);

      const message = error?.message?.toLowerCase() ?? '';

      if (message.includes('not found')) {
        throw new Error('Invoice not found.');
      }

      throw new Error(error.message || 'Internal server error while deleting invoice.');
    }
  }
}