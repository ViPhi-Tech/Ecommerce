import { Routes } from '@angular/router';

export const accountsPayableRoutes: Routes = [
  {
    path: 'list',
    loadComponent: () =>
      import('./screens/list/accounts-payable-list.component').then(
        m => m.AccountsPayableListComponent
      ),
    data: {
      title: ['Dashboard', 'Contas a Pagar'],
    },
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
];
