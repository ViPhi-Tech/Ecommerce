import { Injectable, signal } from '@angular/core';
import { InvoiceDetails } from '../../../shared/interfaces/invoice.interface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  import$ = signal<InvoiceDetails | undefined>(undefined);

  constructor() {}

  importInvoice(invoiceDetails: InvoiceDetails): Observable<any> {
    return of({
      data: invoiceDetails,
      message: 'Nota fiscal importada com sucesso',
      status: true,
    });
  }

  updateimportInvoice(invoiceDetails: InvoiceDetails) {
    this.import$.set(invoiceDetails);
  }
}
