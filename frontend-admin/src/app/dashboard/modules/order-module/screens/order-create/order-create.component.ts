import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  DestroyRef,
} from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { OrderState } from '../../order.state';
import { OrderCartComponent } from '../../components/order-cart/order-cart.component';
import { ProductListComponent } from '../../components/product-list/product-list.component';
import { CoreService } from 'app/shared/services/core.service';
import { CartState } from '../../components/order-cart/order-cart.state';
import { ProductState } from 'app/dashboard/modules/product-module/product.state';

@Component({
  selector: 'fuse-order-create',
  templateUrl: './order-create.component.html',
  styleUrls: ['./order-create.component.scss'],
  imports: [RouterModule, OrderCartComponent, ProductListComponent],
})
export class OrderCreateComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  private coreService = inject(CoreService);
  private orderState = inject(OrderState);
  private productState = inject(ProductState);
  private cartState = inject(CartState);

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
      this.coreService.setPageTitle('Nova Venda', 'Criar uma nova venda');
      this.orderState.resetOrder();
      this.cartState.resetCart();
    }
  }
}
