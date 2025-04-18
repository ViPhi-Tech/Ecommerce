import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceCreateComponent } from './screens/invoice-create/invoice-create.component';

const routes: Routes = [
  {
    path: 'new',
    component: InvoiceCreateComponent,
    data: { title: 'Cadastro de nota fiscal' },
  },
  {
    path: ':id',
    component: InvoiceCreateComponent,
    data: { title: 'Editar nota' },
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [],
})
export class InvoiceDrawerModule {}
