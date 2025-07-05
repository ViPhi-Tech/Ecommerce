import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // {
  //   path: 'new',
  //   component: StockMovementCreateComponent,
  //   data: { title: 'Cadastro de movimento de estoque', animation: 'new-stock-movement' },
  // },
  // {
  //   path: ':id',
  //   component: StockMovementCreateComponent,
  //   data: { title: 'Editar movimento de estoque', animation: 'edit-stock-movement' },
  // },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [],
})
export class StockMovementDrawerModule {}
