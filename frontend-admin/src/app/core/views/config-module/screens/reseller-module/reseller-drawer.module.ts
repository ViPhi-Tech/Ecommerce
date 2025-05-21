import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ResellerCreateComponent } from './screens/reseller-create/reseller-create.component';

const routes: Routes = [
  {
    path: 'new',
    component: ResellerCreateComponent,
    data: { title: 'Cadastro de revendedores' },
  },
  {
    path: ':id',
    component: ResellerCreateComponent,
    data: { title: 'Editar revendedor' },
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [],
})
export class ResellerDrawerModule {}
