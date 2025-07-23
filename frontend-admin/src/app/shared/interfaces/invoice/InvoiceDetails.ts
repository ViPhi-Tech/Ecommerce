import { Identification } from './Identification';
import { Issuer } from './Issuer';
import { ProductInvoice } from './ProductInvoice';
import { Recipient } from './Recipient';
import { Totals } from './Totals';
import { Transportation } from './Transportation';

export interface InvoiceDetails {
  identification: Identification;
  issuer: Issuer;
  recipient: Recipient;
  products: ProductInvoice[];
  totals: Totals;
  transportation: Transportation;
}
