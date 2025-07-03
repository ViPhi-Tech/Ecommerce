import { Injectable, signal, WritableSignal } from '@angular/core';
import { InvoiceDetails } from 'app/shared/interfaces/invoice.interface';
import { Observable, of } from 'rxjs';

interface InvoiceModuleState {
  invoiceList: InvoiceDetails[];
}

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  import$ = signal<InvoiceDetails | undefined>(undefined);

  private state: WritableSignal<InvoiceModuleState> = signal({
    invoiceList: [],
  });

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
