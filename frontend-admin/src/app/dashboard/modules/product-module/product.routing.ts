import { Routes } from '@angular/router';
import { ProductCreateComponent } from './screens/create/product-create.component';

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

// Product Dialog Routes
export const dialogProductRoutes: Routes = [
  {
    path: 'products',
    children: [
      {
        path: 'new',
        component: ProductCreateComponent,
      },
      {
        path: ':id',
        component: ProductCreateComponent,
      },
    ],
  },
];
