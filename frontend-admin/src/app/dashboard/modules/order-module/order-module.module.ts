import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderModuleComponent } from './order-module.component';
import { OrderListComponent } from './screens/order-list/order-list.component';
import { OrderCreateComponent } from './screens/order-create/order-create.component';

const routes: Routes = [
  {
    path: '',
    component: OrderModuleComponent,
    children: [
      {
        path: 'list',
        component: OrderListComponent,
        data: {
          breadcrumb: ['Dashboard', 'Lista de Pedidos'],
        },
      },
      {
        path: 'create',
        component: OrderCreateComponent,
        data: {
          breadcrumb: ['Dashboard', 'Criar Pedido'],
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
  imports: [RouterModule, RouterModule.forChild(routes)],
  declarations: [OrderModuleComponent],
})
export class OrderModuleModule {}
