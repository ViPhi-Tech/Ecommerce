import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderComponent } from './order.component';
import { OrderListComponent } from './screens/order-list/order-list.component';
import { OrderCreateComponent } from './screens/order-create/order-create.component';
import { OrderClientComponent } from './screens/order-create/screens/order-client/order-client.component';
import { OrderProductsComponent } from './screens/order-create/screens/order-products/order-products.component';

const routes: Routes = [
  {
    path: '',
    component: OrderComponent,
    children: [
      {
        path: 'list',
        component: OrderListComponent,
        data: {
          title: ['Dashboard', 'Lista de Pedidos'],
        },
      },
      {
        path: ':id',
        component: OrderCreateComponent,
        children: [
          {
            path: 'client',
            component: OrderClientComponent,
          },
          {
            path: 'products',
            component: OrderProductsComponent,
          },
          {
            path: '**',
            redirectTo: 'client',
            pathMatch: 'full',
          },
        ],
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
  imports: [RouterModule, RouterModule.forChild(routes)],
  declarations: [OrderComponent],
})
export class OrderModule {}
