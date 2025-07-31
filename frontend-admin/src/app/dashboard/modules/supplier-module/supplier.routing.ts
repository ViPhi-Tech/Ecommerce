import { Routes } from '@angular/router';

export const supplierRoutes: Routes = [
  {
    path: 'list',
    loadComponent: () =>
      import('./screens/list/supplier-list.component').then(
        m => m.SupplierListComponent
      ),
    data: {
      title: ['Dashboard', 'Lista de fornecedores'],
    },
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
];
