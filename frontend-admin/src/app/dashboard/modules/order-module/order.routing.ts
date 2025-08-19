import { Routes } from '@angular/router';

export const orderRoutes: Routes = [
  {
    path: 'list',
    loadComponent: () =>
      import('./screens/order-list/order-list.component').then(
        m => m.OrderListComponent
      ),
    data: {
      title: ['Dashboard', 'Lista de Pedidos'],
    },
  },
  {
    path: ':id/view',
    loadComponent: () =>
      import('./screens/order-view/order-view.component').then(
        m => m.OrderViewComponent
      ),
    data: {
      title: ['Dashboard', 'Visualizar Pedido'],
    },
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./screens/order-create/order-create.component').then(
        m => m.OrderCreateComponent
      ),
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
];
