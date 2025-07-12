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
    path: 'new',
    loadComponent: () =>
      import('./screens/create/product-create.component').then(
        m => m.ProductCreateComponent
      ),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./screens/create/product-create.component').then(
        m => m.ProductCreateComponent
      ),
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
];
