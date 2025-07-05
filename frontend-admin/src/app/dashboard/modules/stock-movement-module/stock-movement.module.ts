import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockMovementComponent } from './stock-movement.component';
import { StockMovementListComponent } from './screens/stock-movement-list/stock-movement-list.component';
import { StockMovementState } from './stock-movement.state';
import { StockMovementService } from './stock-movement.service';
import { StockInboundComponent } from './screens/stock-inbound/stock-inbound.component';

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
        path: 'inbound',
        component: StockInboundComponent,
        data: {
          title: ['Dashboard', 'Entradas de estoque'],
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
