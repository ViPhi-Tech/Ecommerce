import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImportInvoiceComponent } from '../../../shared/components/import-invoice/import-invoice.component';

const routes: Routes = [
  {
    path: 'invoice',
    component: ImportInvoiceComponent,
  },
];

@NgModule({
  imports: [RouterModule, RouterModule.forChild(routes)],
})
export class ImportDrawerModule {}
