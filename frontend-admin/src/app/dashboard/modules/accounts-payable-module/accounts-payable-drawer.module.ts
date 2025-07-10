import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AccountsPayableCreateDrawerComponent } from './screens/create-drawer/accounts-payable-create-drawer.component';

const routes: Routes = [
  {
    path: 'new',
    component: AccountsPayableCreateDrawerComponent,
    data: { title: 'Cadastro de conta a pagar' },
  },
  {
    path: ':id',
    component: AccountsPayableCreateDrawerComponent,
    data: { title: 'Editar conta a pagar' },
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [],
})
export class AccountsPayableDrawerModule {}
