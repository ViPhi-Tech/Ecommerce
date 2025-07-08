import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsPayableComponent } from './accounts-payable.component';
import { AccountsPayableListComponent } from './screens/accounts-payable-list/accounts-payable-list.component';

const routes: Routes = [
  {
    path: '',
    component: AccountsPayableComponent,
    children: [
      {
        path: 'list',
        component: AccountsPayableListComponent,
        data: {
          title: ['Dashboard', 'Contas a Pagar'],
        },
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./screens/accounts-payable-create/accounts-payable-create.component').then(
            m => m.AccountsPayableCreateComponent
          ),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./screens/accounts-payable-create/accounts-payable-create.component').then(
            m => m.AccountsPayableCreateComponent
          ),
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
  declarations: [AccountsPayableComponent],
  providers: [],
})
export class AccountsPayableModule {}
