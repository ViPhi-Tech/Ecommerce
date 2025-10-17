import { Routes } from '@angular/router';
import { OrderViewComponent } from './screens/order-view/order-view.component';

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
    path: 'noted',
    loadComponent: () =>
      import('./screens/noted-orders/noted-orders.component').then(
        m => m.NotedOrdersComponent
      ),
    data: {
      title: ['Dashboard', 'Pedidos Anotados'],
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

// Order Dialog Routes
export const dialogOrderRoutes: Routes = [
  {
    path: 'orders',
    children: [
      {
        path: ':id/view',
        component: OrderViewComponent,
      },
    ],
  },
];
