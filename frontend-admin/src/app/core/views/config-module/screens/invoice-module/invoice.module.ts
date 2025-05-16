import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceComponent } from './invoice.component';
import { InvoiceListComponent } from './screens/invoice-list/invoice-list.component';

const routes: Routes = [
  {
    path: '',
    component: InvoiceComponent,
    children: [
      {
        path: 'list',
        component: InvoiceListComponent,
        data: {
          title: ['Dashboard', 'Lista de Notas Fiscais'],
        },
      },
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule, RouterModule.forChild(routes)],
  declarations: [InvoiceComponent],
})
export class InvoiceModule {}
