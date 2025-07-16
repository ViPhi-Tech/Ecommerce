import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  DestroyRef,
} from '@angular/core';
import {
  Router,
  NavigationEnd,
  RouterModule,
  ActivatedRoute,
} from '@angular/router';
import { filter } from 'rxjs';
import { OrderState } from '../../order.state';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
    this.detectChildRouteChanges();
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

  private detectChildRouteChanges() {
    // Detectar mudanças nas rotas filhas através dos eventos do router
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef) // Usando takeUntilDestroyed para evitar vazamentos de memória
      )
      .subscribe((event: NavigationEnd) => {
        this.onChildRouteChange(event.url);
      });
  }

  private async onChildRouteChange(url: string) {
    const orderId = url.split('/')[url.split('/').length - 2]; // Supondo que o ID do pedido esteja antes do módulo atual
    if (orderId !== 'new') {
      await this.orderState.getOrderById(orderId);
    }
  }

  private handleProductsRoute() {
    console.log('Navegou para a rota de produtos');
    // Implementar lógica específica para produtos
  }

  private handleDefaultRoute() {
    console.log('Navegou para a rota padrão');
    // Implementar lógica padrão
  }
}
