import { Routes } from '@angular/router';
import { DebtCreateComponent } from './screens/create/debt-create.component';

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

// Debt Dialog Routes
export const dialogDebtRoutes: Routes = [
  {
    path: 'debts',
    children: [
      {
        path: 'new',
        component: DebtCreateComponent,
      },
      {
        path: ':id',
        component: DebtCreateComponent,
      },
    ],
  },
];
