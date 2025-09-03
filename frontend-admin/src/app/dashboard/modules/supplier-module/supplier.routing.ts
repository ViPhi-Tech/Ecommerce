import { Routes } from '@angular/router';
import { SupplierCreateComponent } from './screens/create/supplier-create.component';

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

// Supplier Dialog Routes
export const dialogSupplierRoutes: Routes = [
  {
    path: 'suppliers',
    children: [
      {
        path: 'new',
        component: SupplierCreateComponent,
      },
      {
        path: ':id',
        component: SupplierCreateComponent,
      },
    ],
  },
];
