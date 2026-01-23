import { Routes } from '@angular/router';

export const purchaseInvoiceRoutes: Routes = [
  {
    path: 'list',
    loadComponent: () =>
      import('./screens/list/purchase-invoice-list.component').then(
        m => m.PurchaseInvoiceListComponent
      ),
    data: {
      title: ['Dashboard', 'Notas Fiscais de Entrada'],
    },
  },
  {
    path: ':id/view',
    loadComponent: () =>
      import('./screens/view/purchase-invoice-view.component').then(
        m => m.PurchaseInvoiceViewComponent
      ),
    data: {
      title: ['Dashboard', 'Visualizar Nota Fiscal'],
    },
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
];
