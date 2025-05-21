import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResellerComponent } from './reseller.component';
import { ResellerListComponent } from './screens/reseller-list/reseller-list.component';
import { ResellerState } from 'app/shared/store/reseller.state';

const routes: Routes = [
  {
    path: '',
    component: ResellerComponent,
    children: [
      {
        path: 'list',
        component: ResellerListComponent,
        data: {
          title: ['Dashboard', 'Lista de produtos'],
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
  declarations: [ResellerComponent],
  providers: [ResellerState],
})
export class ResellerModule {}
