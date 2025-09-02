import { Routes } from '@angular/router';

export const userRoutes: Routes = [
  {
    path: 'list',
    loadComponent: () =>
      import('./screens/list/user-list.component').then(
        m => m.UserListComponent
      ),
    data: {
      title: ['Dashboard', 'Lista de usuários'],
    },
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
];
