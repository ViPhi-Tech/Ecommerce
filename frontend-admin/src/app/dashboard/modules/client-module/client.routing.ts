import { Routes } from '@angular/router';

export const clientRoutes: Routes = [
  {
    path: 'list',
    loadComponent: () =>
      import('./screens/list/client-list.component').then(
        m => m.ClientListComponent
      ),
    data: {
      title: ['Dashboard', 'Lista de clientes'],
    },
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
];
