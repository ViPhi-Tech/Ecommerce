import { Routes } from '@angular/router';
import { ClientCreateComponent } from './screens/create/client-create.component';

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

// Client Dialog Routes
export const dialogClientRoutes: Routes = [
  {
    path: 'clients',
    children: [
      {
        path: 'new',
        component: ClientCreateComponent,
      },
      {
        path: ':id',
        component: ClientCreateComponent,
      },
    ],
  },
];
