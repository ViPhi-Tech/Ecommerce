import { Invoice } from "../entities/Invoice";
import { InvoiceItem } from "../entities/InvoiceItem";
export interface IInvoiceRepository {
  create(invoice: Invoice): Promise<Invoice>;
  findById(id: number): Promise<Invoice | null>;
  findAll(): Promise<Invoice[]>;
  update(id: number, invoice: Partial<Invoice>): Promise<Invoice | null>;
  delete(id: number): Promise<void>;
  createItems(invoiceId: number, data: InvoiceItem[]): Promise<InvoiceItem[]>;
  findItemsByInvoiceID(invoiceId: number): Promise<InvoiceItem[]>;
}