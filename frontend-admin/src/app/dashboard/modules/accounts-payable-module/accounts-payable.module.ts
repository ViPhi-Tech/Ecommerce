import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsPayableComponent } from './accounts-payable.component';
import { AccountsPayableListComponent } from './screens/list/accounts-payable-list.component';

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
