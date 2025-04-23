import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomizationComponent } from './customization.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
   {
      path: '',
      component: CustomizationComponent,
      children: [
         {
            path: 'home',
            component: HomeComponent
         }
      ]
   }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  declarations: []
})
export class CustomizationModule { }
