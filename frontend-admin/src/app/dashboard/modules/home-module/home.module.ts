import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxEchartsModule } from 'ngx-echarts';
import { homeRoutes } from './home.routing';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(homeRoutes),
    NgxEchartsModule.forChild()
  ]
})
export class HomeModule { }
