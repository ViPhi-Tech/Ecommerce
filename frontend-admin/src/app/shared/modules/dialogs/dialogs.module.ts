import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { InboundComponent } from 'app/dashboard/modules/stock-movement-module/screens/inbound/inbound.component';
import { OutboundComponent } from 'app/dashboard/modules/stock-movement-module/screens/outbound/outbound.component';
import { CategoryCreateComponent } from 'app/dashboard/modules/category-module/screens/create/category-create.component';
import { ClientCreateComponent } from 'app/dashboard/modules/client-module/screens/create/client-create.component';
import { SupplierCreateComponent } from 'app/dashboard/modules/supplier-module/screens/create/supplier-create.component';
import { AccountsPayableCreateComponent } from 'app/dashboard/modules/accounts-payable-module/screens/create/accounts-payable-create.component';
import { AccountsReceivableCreateComponent } from 'app/dashboard/modules/accounts-receivable-module/screens/create/accounts-receivable-create.component';
import { OrderViewComponent } from 'app/dashboard/modules/order-module/screens/order-view/order-view.component';
import { UserCreateComponent } from 'app/dashboard/modules/user-module/screens/create/user-create.component';
import { ProductCreateComponent } from 'app/dashboard/modules/product-module/screens/create/product-create.component';

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
  // supplier routes
  {
    path: 'suppliers',
    children: [
      {
        path: 'new',
        component: SupplierCreateComponent,
      },
      {
        path: ':id',
        component: SupplierCreateComponent,
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
        path: ':id/view',
        component: AccountsPayableCreateComponent,
      },
      {
        path: ':id',
        component: AccountsPayableCreateComponent,
      },
    ],
  },
  {
    path: 'accounts-receivable',
    children: [
      {
        path: 'new',
        component: AccountsReceivableCreateComponent,
      },
      {
        path: ':id/view',
        component: AccountsReceivableCreateComponent,
      },
      {
        path: ':id',
        component: AccountsReceivableCreateComponent,
      },
    ],
  },
  {
    path: 'orders',
    children: [
      {
        path: ':id/view',
        component: OrderViewComponent,
      },
    ],
  },
  // user routes
  {
    path: 'users',
    children: [
      {
        path: 'new',
        component: UserCreateComponent,
      },
      {
        path: 'edit/:id',
        component: UserCreateComponent,
      },
    ],
  },
  // product routes
  {
    path: 'products',
    children: [
      {
        path: 'new',
        component: ProductCreateComponent,
      },
      {
        path: ':id',
        component: ProductCreateComponent,
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [],
})
export class DialogsModule {}
