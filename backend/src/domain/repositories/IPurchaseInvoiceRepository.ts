import { PurchaseInvoice } from "../entities/PurchaseInvoice";
import { PurchaseInvoiceItem } from "../entities/PurchaseInvoiceItem";

export interface IPurchaseInvoiceRepository {
  create(purchaseInvoice: PurchaseInvoice): Promise<PurchaseInvoice>;
  findById(id: number): Promise<PurchaseInvoice | null>;
  findByAccessKey(accessKey: string): Promise<PurchaseInvoice | null>;
  findAll(): Promise<PurchaseInvoice[]>;
  createItems(purchaseInvoiceId: number, items: PurchaseInvoiceItem[]): Promise<PurchaseInvoiceItem[]>;
  findItemsByPurchaseInvoiceId(purchaseInvoiceId: number): Promise<PurchaseInvoiceItem[]>;
}
