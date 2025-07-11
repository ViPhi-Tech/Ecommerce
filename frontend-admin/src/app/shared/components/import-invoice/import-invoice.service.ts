import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImportInvoiceService {
  private openDialogSubj = new Subject<any>();
  openDialog$ = this.openDialogSubj.asObservable();

  private onImportSubj = new Subject<any>();
  onImport$ = this.onImportSubj.asObservable();

  constructor() {}

  openDialog(data: any) {
    this.openDialogSubj.next(data);
  }

  importInvoices(data: any) {
    this.onImportSubj.next(data);
  }
}
