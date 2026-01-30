import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, Subject } from 'rxjs';
import { Order, OrderModuleState } from './interfaces/order.interface';
import { lastValueFrom } from 'rxjs';
import { OrderService } from './order.service';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { BaseState } from 'app/shared/store/base.state';
import { PAYMENTS_SITEMAP } from 'app/shared/constants/payments.sitemap';

@Injectable({
  providedIn: 'root',
})
export class OrderState extends BaseState<OrderModuleState> {
  private orderService = inject(OrderService);

  private refreshOrderSubject = new Subject<Order>();
  refreshOrder$ = this.refreshOrderSubject.asObservable();

  protected state = signal<OrderModuleState>({
    orderList: [],
    notedOrderList: [],
    orderDetails: {} as Order, // Inicializa com um objeto vazio ou pode ser null se não houver detalhes carregados
    loading: false,
    error: null,
  });

  orderList = computed(() => this.state().orderList);
  orderDetails = computed(() => this.state().orderDetails);
  notedOrderList = computed(() => this.state().notedOrderList);

  totalSales = computed(() =>
    this.orderList().reduce((sum, order) => sum + (Number(order.total) || 0), 0)
  );

  bestSellingProduct = computed(() => {
    const productMap = new Map<number, { name: string; quantity: number }>();
    for (const order of this.orderList()) {
      for (const item of order.items || []) {
        const key = item.productId;
        const name = item.product?.name ?? `Produto #${key}`;
        const prev = productMap.get(key) ?? { name, quantity: 0 };
        productMap.set(key, {
          name: prev.name,
          quantity: prev.quantity + (item.quantity || 0),
        });
      }
    }
    let best: { name: string; quantity: number } = { name: '—', quantity: 0 };
    productMap.forEach(v => {
      if (v.quantity > best.quantity) best = v;
    });
    return best;
  });

  mostUsedPayment = computed(() => {
    const countByType = new Map<string, number>();
    for (const order of this.orderList()) {
      for (const payment of order.payments || []) {
        const typeId = (payment.typeId ?? '').toString().toUpperCase();
        if (typeId) {
          countByType.set(typeId, (countByType.get(typeId) ?? 0) + 1);
        }
      }
    }
    let bestType = '';
    let bestCount = 0;
    countByType.forEach((count, typeId) => {
      if (count > bestCount) {
        bestCount = count;
        bestType = typeId;
      }
    });
    const name =
      (PAYMENTS_SITEMAP[bestType as keyof typeof PAYMENTS_SITEMAP]?.name) ??
      (bestType || '—');
    return { name, count: bestCount };
  });

  createPreOrder(clientId: string | number): Promise<Order> {
    this.setLoading(true);
    this.clearError();

    return lastValueFrom(
      this.orderService.createPreOrder(clientId).pipe(
        catchError(error => this.handleError(error)),
        finalize(() => this.setLoading(false))
      )
    ).then(response => {
      return response.data;
    });
  }

  getOrderList(skipLoader = true, isNoted = false): void {
    this.setLoading(true);
    this.clearError();
    this.setOrderList([], isNoted);

    lastValueFrom(
      this.orderService.getOrders(skipLoader).pipe(
        catchError(error => this.handleError(error)),
        finalize(() => this.setLoading(false))
      )
    )
      .then((response: ApiResponse<Order[]>) => {
        const orders = Array.isArray(response)
          ? response
          : response?.data || response?.dados;
        if (orders && orders.length > 0) {
          this.setOrderList(orders, isNoted);
        } else {
          this.setOrderList([], isNoted);
          this.setError('Nenhum pedido encontrado.');
        }
      })
      .catch(error => {
        this.setError('Erro ao carregar a lista de pedidos');
        console.error('Erro ao buscar pedidos:', error);
      });
  }

  getAvailableOrdersList(skipLoader = true, deliveryId?: number): void {
    this.setLoading(true);
    this.clearError();
    this.setOrderList([], false);

    lastValueFrom(
      this.orderService.getAvailableOrders(skipLoader, deliveryId).pipe(
        catchError(error => this.handleError(error)),
        finalize(() => this.setLoading(false))
      )
    )
      .then((response: ApiResponse<Order[]>) => {
        const orders = Array.isArray(response)
          ? response
          : response?.data || response?.dados;
        if (orders && orders.length > 0) {
          this.setOrderList(orders, false);
        } else {
          this.setOrderList([], false);
          this.setError('Nenhum pedido disponível encontrado.');
        }
      })
      .catch(error => {
        this.setError('Erro ao carregar a lista de pedidos disponíveis');
        console.error('Erro ao buscar pedidos disponíveis:', error);
      });
  }

  setOrderList(orderList: Order[], isNoted = false) {
    let transformedOrders = orderList.map(order => {
      return {
        ...order,
        customerName: order.client?.fullName,
        payments: order.payments?.map(payment => ({
          ...payment,
          typeId: payment.typeId.toString(),
          name: PAYMENTS_SITEMAP[
            payment.typeId.toUpperCase() as keyof typeof PAYMENTS_SITEMAP
          ]?.name,
        })),
      };
    });

    if (isNoted) {
      // Calcula o total dos pedidos anotados
      transformedOrders = transformedOrders.map(order => ({
        ...order,
        total:
          order?.payments
            ?.filter(
              p =>
                p.typeId.toUpperCase() ===
                PAYMENTS_SITEMAP.ACCOUNT_RECEIVABLE.id.toUpperCase()
            )
            .reduce((acc, p) => acc + p.value, 0) || 0,
      }));
      this.updateState('notedOrderList', transformedOrders);
    } else {
      this.updateState('orderList', transformedOrders);
    }
  }

  getOrderById(orderId: string | number): Promise<Order> {
    this.setLoading(true);
    this.clearError();

    return lastValueFrom(
      this.orderService.getOrderById(orderId).pipe(
        catchError(error => this.handleError(error)),
        finalize(() => this.setLoading(false))
      )
    ).then((response: ApiResponse<Order>) => {
      this.updateState('orderDetails', response.data);
      this.refreshOrderSubject.next(response.data); // Notifica que os detalhes do pedido foram atualizados
      return response.data;
    });
  }

  getOrderListByClient(
    clientId: string | number,
    startDate: string,
    endDate: string,
    paymentTypeId: string,
    isNoted = false
  ): void {
    this.setLoading(true);
    this.clearError();
    this.setOrderList([], isNoted);

    lastValueFrom(
      this.orderService
        .getOrdersByClient(true, {
          clientId,
          startDate,
          endDate,
          paymentTypeId,
        })
        .pipe(
          catchError(error => this.handleError(error)),
          finalize(() => this.setLoading(false))
        )
    )
      .then((response: ApiResponse<Order[]>) => {
        const orders = Array.isArray(response)
          ? response
          : response?.data || response?.dados;
        if (orders && orders.length > 0) {
          this.setOrderList(orders, isNoted);
        } else {
          this.setOrderList([], isNoted);
          this.setError('Nenhum pedido encontrado.');
        }
      })
      .catch(error => {
        this.setError('Erro ao carregar a lista de pedidos');
        console.error('Erro ao buscar pedidos:', error);
      });
  }

  resetOrder() {
    this.updateState('orderDetails', {} as Order);
  }
}
