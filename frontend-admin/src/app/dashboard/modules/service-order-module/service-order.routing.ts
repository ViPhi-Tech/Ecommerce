import { Routes } from '@angular/router';
import { ServiceOrderCreateComponent } from './screens/create/service-order-create.component';

export const serviceOrderRoutes: Routes = [
  {
    path: 'list',
    loadComponent: () =>
      import('./screens/list/service-order-list.component').then(
        m => m.ServiceOrderListComponent
      ),
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
];

// Service Order Dialog Routes
export const dialogServiceOrderRoutes: Routes = [
  {
    path: 'service-orders',
    children: [
      {
        path: 'new',
        component: ServiceOrderCreateComponent,
      },
      {
        path: ':id',
        component: ServiceOrderCreateComponent,
      },
    ],
  },
];
