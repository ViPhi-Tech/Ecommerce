import { Routes } from '@angular/router';
import { AccountsPayableCreateComponent } from './screens/create/accounts-payable-create.component';
import { AccountsPayableRedirectComponent } from './screens/accounts-payable-redirect.component';

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
    component: AccountsPayableRedirectComponent,
    pathMatch: 'full',
  },
];

// Accounts Payable Dialog Routes
export const dialogAccountsPayableRoutes: Routes = [
  {
    path: 'accounts-payable',
    children: [
      {
        path: 'new',
        component: AccountsPayableCreateComponent,
      },
      {
        path: ':id/view',
        component: AccountsPayableCreateComponent,
      },
      {
        path: ':id',
        component: AccountsPayableCreateComponent,
      },
    ],
  },
];
