import { Routes } from '@angular/router';

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
