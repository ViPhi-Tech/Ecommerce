import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { dialogRoutes } from '../../../app.routes';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(dialogRoutes)],
  declarations: [],
})
export class DialogsModule {}
