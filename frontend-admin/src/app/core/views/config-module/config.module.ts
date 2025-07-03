import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigComponent } from './config.component';
import { CardItemComponent } from 'app/shared/components/card-item/card-item.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigComponent,
  },
];

@NgModule({
  imports: [RouterModule, RouterModule.forChild(routes), CardItemComponent],
  declarations: [ConfigComponent],
})
export class ConfigModule {}
