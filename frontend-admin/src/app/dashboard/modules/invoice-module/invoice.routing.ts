import { Routes } from '@angular/router';

export const invoiceRoutes: Routes = [
  {
    path: 'list',
    loadComponent: () =>
      import('./screens/invoice-list/invoice-list.component').then(
        m => m.InvoiceListComponent
      ),
    data: {
      title: ['Dashboard', 'Lista de Notas Fiscais'],
    },
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
];
