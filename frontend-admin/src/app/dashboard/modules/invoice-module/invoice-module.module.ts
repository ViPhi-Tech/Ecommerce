import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceModuleComponent } from './invoice-module.component';
import { InvoiceListComponent } from './screens/invoice-list/invoice-list.component';

const routes: Routes = [
  {
    path: '',
    component: InvoiceModuleComponent,
    children: [
      {
        path: 'list',
        component: InvoiceListComponent,
        data: {
          breadcrumb: ['Dashboard', 'Lista de Notas Fiscais'],
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
  declarations: [InvoiceModuleComponent],
})
export class InvoiceModuleModule {}
