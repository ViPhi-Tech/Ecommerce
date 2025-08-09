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
    path: 'kanban',
    loadComponent: () =>
      import('./screens/kanban/accounts-payable-kanban.component').then(
        m => m.AccountsPayableKanbanComponent
      ),
    data: {
      title: ['Dashboard', 'Contas a Pagar', 'Kanban'],
    },
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
];
