import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { dialogCategoryRoutes } from 'app/dashboard/modules/category-module/category.routing';
import { dialogClientRoutes } from 'app/dashboard/modules/client-module/client.routing';
import { dialogSupplierRoutes } from 'app/dashboard/modules/supplier-module/supplier.routing';
import { dialogStockMovementRoutes } from 'app/dashboard/modules/stock-movement-module/stock-movement.routing';
import { dialogAccountsPayableRoutes } from 'app/dashboard/modules/accounts-payable-module/accounts-payable.routing';
import { dialogAccountsReceivableRoutes } from 'app/dashboard/modules/accounts-receivable-module/accounts-receivable.routing';
import { dialogOrderRoutes } from 'app/dashboard/modules/order-module/order.routing';
import { dialogProductRoutes } from 'app/dashboard/modules/product-module/product.routing';
import { dialogServiceOrderRoutes } from 'app/dashboard/modules/service-order-module/service-order.routing';
import { dialogUserRoutes } from 'app/dashboard/modules/user-module/user.routing';

// Combined dialog routes
export const dialogRoutes: Routes  = [
  ...dialogCategoryRoutes,
  ...dialogClientRoutes,
  ...dialogSupplierRoutes,
  ...dialogStockMovementRoutes,
  ...dialogAccountsPayableRoutes,
  ...dialogAccountsReceivableRoutes,
  ...dialogOrderRoutes,
  ...dialogUserRoutes,
  ...dialogProductRoutes,
  ...dialogServiceOrderRoutes,
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(dialogRoutes)],
  declarations: [],
})
export class DialogsModule {}
