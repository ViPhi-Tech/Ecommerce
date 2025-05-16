import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DiscountTicketCreateComponent } from './screens/discount-ticket-create/discount-ticket-create.component';

const routes: Routes = [
  {
    path: 'new',
    component: DiscountTicketCreateComponent,
    data: { title: 'Cadastro de cupom' },
  },
  {
    path: ':id',
    component: DiscountTicketCreateComponent,
    data: { title: 'Editar cupom' },
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [],
})
export class DiscountTicketDrawerModule {}
