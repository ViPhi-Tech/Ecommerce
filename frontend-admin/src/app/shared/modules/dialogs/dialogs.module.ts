import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { InboundComponent } from 'app/dashboard/modules/stock-movement-module/screens/inbound/inbound.component';

const routes: Routes = [
  {
    path: "inbound",
    children: [
      {
        path: 'new',
        component: InboundComponent,
      },
      {
        path: ':id',
        component: InboundComponent,
      },
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [],
})
export class DialogsModule {}
