import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  DestroyRef,
  signal,
} from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { OrderState } from '../../order.state';
import { OrderCartComponent } from '../../components/order-cart/order-cart.component';
import { ProductListComponent } from '../../components/product-list/product-list.component';
import { CartState } from '../../components/order-cart/order-cart.state';
import { ProductState } from 'app/dashboard/modules/product-module/product.state';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'fuse-order-create',
  templateUrl: './order-create.component.html',
  styleUrls: ['./order-create.component.scss'],
  imports: [
    RouterModule,
    OrderCartComponent,
    ProductListComponent,
    DrawerModule,
    ButtonModule,
    NgIcon,
  ],
})
export class OrderCreateComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  private orderState = inject(OrderState);
  private productState = inject(ProductState);
  public cartState = inject(CartState);

  // Controla a visibilidade do drawer do carrinho no mobile
  cartDrawerVisible = signal(false);

  constructor() {}

  ngOnInit() {
    this.productState.clearState();
    this.loadOrderData();
  }

  ngOnDestroy() {}

  private async loadOrderData() {
    const orderId = this.activatedRoute.snapshot.paramMap.get('id');
    if (orderId && orderId !== 'new') {
      // await this.orderState.getOrderById(orderId);
    } else {
      this.orderState.resetOrder();
      this.cartState.resetCart();
    }
  }

  openCartDrawer() {
    this.cartDrawerVisible.set(true);
  }

  closeCartDrawer() {
    this.cartDrawerVisible.set(false);
  }
}
