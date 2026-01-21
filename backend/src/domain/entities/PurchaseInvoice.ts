import { PurchaseInvoiceItem } from "./PurchaseInvoiceItem";

export interface PurchaseInvoice {
  id?: number;
  accessKey: string; // chNFe - chave única
  number: string;
  series: string;
  model: number;
  issueDate: Date;
  entryDate: Date;
  totalAmount: number;
  totalTax: number;
  xmlRaw: any; // JSON do XML completo
  protocol: any; // protNFe.infProt
  supplierId: number;
  items?: PurchaseInvoiceItem[];
  createdAt?: Date;
}
