import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImportInvoiceService {
  private openDialogSubj = new Subject<any>();
  openDialog$ = this.openDialogSubj.asObservable();

  constructor() {}

  openDialog(data: any) {
    this.openDialogSubj.next(data);
  }
}
