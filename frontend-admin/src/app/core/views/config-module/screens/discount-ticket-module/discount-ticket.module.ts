import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiscountTicketComponent } from './discount-ticket.component';
import { DiscountTicketListComponent } from './screens/discount-ticket-list/discount-ticket-list.component';

const routes: Routes = [
  {
    path: '',
    component: DiscountTicketComponent,
    children: [
      {
        path: 'list',
        component: DiscountTicketListComponent,
        data: {
          title: ['Dashboard', 'Lista de cupons'],
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
  declarations: [DiscountTicketComponent],
})
export class DiscountTicketModule {}
