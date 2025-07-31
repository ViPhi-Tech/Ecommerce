import { Routes } from '@angular/router';

export const accountsReceivableRoutes: Routes = [
  {
    path: 'list',
    loadComponent: () =>
      import('./screens/list/accounts-receivable-list.component').then(
        m => m.AccountsReceivableListComponent
      ),
    data: {
      title: ['Dashboard', 'Contas a Receber'],
    },
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./screens/create/accounts-receivable-create.component').then(
        m => m.AccountsReceivableCreateComponent
      ),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./screens/create/accounts-receivable-create.component').then(
        m => m.AccountsReceivableCreateComponent
      ),
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
];
