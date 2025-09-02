import { Routes } from '@angular/router';

export const productRoutes: Routes = [
  {
    path: 'list',
    loadComponent: () =>
      import('./screens/list/product-list.component').then(
        m => m.ProductListComponent
      ),
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
];
