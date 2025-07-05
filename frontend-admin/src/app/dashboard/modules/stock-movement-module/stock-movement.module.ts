import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockMovementComponent } from './stock-movement.component';
import { StockMovementListComponent } from './screens/stock-movement-list/stock-movement-list.component';
import { StockMovementState } from './stock-movement.state';
import { StockMovementService } from './stock-movement.service';

const routes: Routes = [
  {
    path: '',
    component: StockMovementComponent,
    children: [
      {
        path: 'list',
        component: StockMovementListComponent,
        data: {
          title: ['Dashboard', 'Lista de movimentos de estoque'],
        },
      },
      {
        path: 'product/:productId',
        component: StockMovementListComponent,
        data: {
          title: ['Dashboard', 'Movimentos de estoque do produto'],
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
  imports: [RouterModule.forChild(routes), StockMovementListComponent],
  declarations: [StockMovementComponent],
  providers: [StockMovementState, StockMovementService],
})
export class StockMovementModule {}
