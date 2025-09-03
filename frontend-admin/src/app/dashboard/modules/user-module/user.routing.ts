import { Routes } from '@angular/router';
import { UserCreateComponent } from './screens/create/user-create.component';

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

// User Dialog Routes
export const dialogUserRoutes: Routes = [
  {
    path: 'users',
    children: [
      {
        path: 'new',
        component: UserCreateComponent,
      },
      {
        path: 'edit/:id',
        component: UserCreateComponent,
      },
    ],
  },
];
