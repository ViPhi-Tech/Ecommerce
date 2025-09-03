import { Routes } from '@angular/router';
import { InboundComponent } from './screens/inbound/inbound.component';
import { OutboundComponent } from './screens/outbound/outbound.component';

export const stockMovementRoutes: Routes = [
  {
    path: 'list',
    loadComponent: () =>
      import('./screens/list/stock-movement-list.component').then(
        m => m.StockMovementListComponent
      ),
    data: {
      title: ['Dashboard', 'Lista de movimentos de estoque'],
    },
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
];

// Stock Movement Dialog Routes
export const dialogStockMovementRoutes: Routes = [
  {
    path: 'inbound',
    children: [
      {
        path: 'new',
        component: InboundComponent,
      },
      {
        path: ':id',
        component: InboundComponent,
      },
    ],
  },
  {
    path: 'outbound',
    children: [
      {
        path: 'new',
        component: OutboundComponent,
      },
      {
        path: ':id',
        component: OutboundComponent,
      },
    ],
  },
];
