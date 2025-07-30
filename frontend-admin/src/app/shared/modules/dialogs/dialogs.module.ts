import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { InboundComponent } from 'app/dashboard/modules/stock-movement-module/screens/inbound/inbound.component';
import { OutboundComponent } from 'app/dashboard/modules/stock-movement-module/screens/outbound/outbound.component';
import { CategoryCreateComponent } from 'app/dashboard/modules/category-module/screens/create/category-create.component';
import { ClientCreateComponent } from 'app/dashboard/modules/client-module/screens/create/client-create.component';
import { AccountsPayableCreateComponent } from 'app/dashboard/modules/accounts-payable-module/screens/create/accounts-payable-create.component';

const routes: Routes = [
  // category routes
  {
    path: 'categories',
    children: [
      {
        path: 'new',
        component: CategoryCreateComponent,
      },
      {
        path: ':id',
        component: CategoryCreateComponent,
      },
    ],
  },
  // client routes
  {
    path: 'clients',
    children: [
      {
        path: 'new',
        component: ClientCreateComponent,
      },
      {
        path: ':id',
        component: ClientCreateComponent,
      },
    ],
  },
  {
    path: 'inbound',
    children: [
      {
        path: 'new',
        component: InboundComponent,
      },
      {
        path: ':id',
        component: InboundComponent,
      },
    ],
  },
  {
    path: 'outbound',
    children: [
      {
        path: 'new',
        component: OutboundComponent,
      },
      {
        path: ':id',
        component: OutboundComponent,
      },
    ],
  },
  {
    path: 'accounts-payable',
    children: [
      {
        path: 'new',
        component: AccountsPayableCreateComponent,
      },
      {
        path: ':id',
        component: AccountsPayableCreateComponent,
      },
    ],
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [],
})
export class DialogsModule {}
