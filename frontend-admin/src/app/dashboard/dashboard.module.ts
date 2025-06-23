import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { LogoComponent } from './components/logo/logo.component';
import { isAuthGuard } from 'app/shared/guards/is-auth.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [isAuthGuard],
    data: {
      breadcrumb: 'Dashboard',
    },
    children: [
      {
        path: 'customization',
        loadChildren: () =>
          import('./modules/customization/customization.module').then(
            m => m.CustomizationModule
          ),
        data: { animation: 'customization' },
      },
      {
        path: 'orders',
        loadChildren: () =>
          import('./modules/order-module/order.module').then(
            m => m.OrderModule
          ),
      },
      {
        path: 'config',
        loadChildren: () =>
          import('app/core/views/config-module/config.module').then(
            m => m.ConfigModule
          ),
      },
      {
        path: '**',
        redirectTo: 'orders',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    RouterModule.forChild(routes),

    // components
    SidebarComponent,
    HeaderComponent,
    LogoComponent,
  ],
  declarations: [DashboardComponent],
})
export class DashboardModule {}
