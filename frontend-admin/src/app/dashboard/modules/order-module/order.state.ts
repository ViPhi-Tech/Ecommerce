import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, Subject } from 'rxjs';
import { Order, OrderModuleState } from './interfaces/order.interface';
import { lastValueFrom } from 'rxjs';
import { OrderService } from './order.service';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { BaseState } from 'app/shared/store/base.state';

@Injectable({
  providedIn: 'root',
})
export class OrderState extends BaseState<OrderModuleState> {
  private orderService = inject(OrderService);

  private refreshOrderSubject = new Subject<Order>();
  refreshOrder$ = this.refreshOrderSubject.asObservable();

  protected state = signal<OrderModuleState>({
    orderList: [],
    orderDetails: {} as Order, // Inicializa com um objeto vazio ou pode ser null se não houver detalhes carregados
    view:
      (localStorage.getItem('orderView') as OrderModuleState['view']) || 'list',
    loading: false,
    error: null,
  });

  orderList = computed(() => this.state().orderList);
  orderDetails = computed(() => this.state().orderDetails);
  currentView = computed(() => this.state().view);

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

  getOrderList(skipLoader = true): void {
    this.setLoading(true);
    this.clearError();
    this.setOrderList([]);

    lastValueFrom(
      this.orderService.getOrders(skipLoader).pipe(
        catchError(error => this.handleError(error)),
        finalize(() => this.setLoading(false))
      )
    )
      .then((response: ApiResponse<Order[]>) => {
        const orders = Array.isArray(response) ? response : response.data;
        if (orders && orders.length > 0) {
          this.setOrderList(orders);
        } else {
          this.setOrderList([]);
          this.setError('Nenhum pedido encontrado.');
        }
      })
      .catch(error => {
        this.setError('Erro ao carregar a lista de pedidos');
        console.error('Erro ao buscar pedidos:', error);
      });
  }

  setOrderList(orderList: Order[]) {
    const transformedOrders = orderList.map(order => {
      return {
        ...order,
        customerName: order.client?.fullName,
      };
    });

    this.updateState('orderList', transformedOrders);
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

  resetOrder() {
    this.updateState('orderDetails', {} as Order);
  }

  setView(view: 'list' | 'grid') {
    this.updateState('view', view);
    localStorage.setItem('orderView', view);
  }
}
