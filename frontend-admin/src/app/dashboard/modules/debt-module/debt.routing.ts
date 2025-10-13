import { Routes } from '@angular/router';

export const debtRoutes: Routes = [
  {
    path: 'list',
    loadComponent: () =>
      import('./screens/list/debt-list.component').then(
        m => m.DebtListComponent
      ),
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
];