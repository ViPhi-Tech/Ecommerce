import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsReceivableComponent } from './accounts-receivable.component';
import { AccountsReceivableListComponent } from './screens/accounts-receivable-list/accounts-receivable-list.component';

const routes: Routes = [
  {
    path: '',
    component: AccountsReceivableComponent,
    children: [
      {
        path: 'list',
        component: AccountsReceivableListComponent,
        data: {
          title: ['Dashboard', 'Contas a Pagar'],
        },
      },
      {
        path: 'new',
        loadComponent: () =>
          import(
            './screens/accounts-receivable-create/accounts-receivable-create.component'
          ).then(m => m.AccountsReceivableCreateComponent),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import(
            './screens/accounts-receivable-create/accounts-receivable-create.component'
          ).then(m => m.AccountsReceivableCreateComponent),
      },
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  declarations: [AccountsReceivableComponent],
  providers: [],
})
export class AccountsReceivableModule {}
