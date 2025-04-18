import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiscountTicketModuleComponent } from './discount-ticket-module.component';
import { DiscountTicketListComponent } from './screens/discount-ticket-list/discount-ticket-list.component';

const routes: Routes = [
  {
    path: '',
    component: DiscountTicketModuleComponent,
    children: [
      {
        path: 'list',
        component: DiscountTicketListComponent,
        data: {
          breadcrumb: ['Dashboard', 'Lista de cupons'],
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
  declarations: [DiscountTicketModuleComponent],
})
export class DiscountTicketModule {}
