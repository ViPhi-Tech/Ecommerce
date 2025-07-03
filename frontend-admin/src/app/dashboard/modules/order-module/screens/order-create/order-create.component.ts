import { Component, OnInit, OnDestroy, inject, DestroyRef } from '@angular/core';
import { Router, NavigationEnd, RouterModule, ActivatedRoute } from '@angular/router';
import { OrderHeaderComponent } from '../../components/order-header/order-header.component';
import { filter } from 'rxjs';
import { OrderState } from '../../order.state';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'fuse-order-create',
  templateUrl: './order-create.component.html',
  styleUrls: ['./order-create.component.scss'],
  imports: [OrderHeaderComponent, RouterModule],
})
export class OrderCreateComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  private destroyRef = inject(DestroyRef);
  private orderState = inject(OrderState);
  
  constructor() {}

  ngOnInit() {
    this.loadOrderData();
    this.detectChildRouteChanges();
  }

  ngOnDestroy() {
  }

  private async loadOrderData() {
    const orderId = this.activatedRoute.snapshot.paramMap.get('id');
    if (orderId && orderId !== 'new') {
      await this.orderState.getOrderById(orderId);
    } else {
      this.orderState.resetOrder();
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
