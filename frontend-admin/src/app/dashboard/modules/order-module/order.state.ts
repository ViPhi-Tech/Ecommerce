import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, Observable, of, Subject } from 'rxjs';
import { Order, OrderModuleState } from './interfaces/order.interface';
import { lastValueFrom } from 'rxjs';
import { OrderService } from './order.service';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';

@Injectable({
  providedIn: 'root',
})
export class OrderState {
  private orderService = inject(OrderService);

  private refreshOrderSubject = new Subject<Order>();
  refreshOrder$ = this.refreshOrderSubject.asObservable();

  private state = signal<OrderModuleState>({
    orderList: [],
    orderDetails: {} as Order, // Inicializa com um objeto vazio ou pode ser null se não houver detalhes carregados
    view:
      (localStorage.getItem('orderView') as OrderModuleState['view']) ||
      'table',
    loading: false,
    error: null,
  });

  orderList = computed(() => this.state().orderList);
  orderDetails = computed(() => this.state().orderDetails);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);
  currentView = computed(() => this.state().view);

  createPreOrder(clientId: string | number): Promise<Order> {
    this.setLoading(true);
    this.setError(null);

    return lastValueFrom(
      this.orderService.createPreOrder(clientId).pipe(
        catchError(error => this.handleError(error)),
        finalize(() => this.setLoading(false))
      )
    ).then(response => {
      return response.data;
    });
  }

  getOrderList(): void {
    this.setLoading(true);
    this.setError(null);
    this.setOrderList([]);

    lastValueFrom(
      this.orderService.getOrders().pipe(
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

    this.state.update(state => ({
      ...state,
      orderList: transformedOrders,
    }));
  }

  getOrderById(orderId: string | number): Promise<Order> {
    this.setLoading(true);
    this.setError(null);

    return lastValueFrom(
      this.orderService.getOrderById(orderId).pipe(
        catchError(error => this.handleError(error)),
        finalize(() => this.setLoading(false))
      )
    ).then((response: ApiResponse<Order>) => {
      this.state.update(state => ({
        ...state,
        orderDetails: response.data,
      }));
      this.refreshOrderSubject.next(response.data); // Notifica que os detalhes do pedido foram atualizados
      return response.data;
    });
  }

  resetOrder() {
    this.state.update(state => ({
      ...state,
      orderDetails: {} as Order, // Reseta os detalhes do pedido
    }));
  }

  setView(view: 'table' | 'list') {
    this.state.update(state => ({
      ...state,
      view,
    }));
    localStorage.setItem('orderView', view);
  }

  setLoading(loading: boolean) {
    this.state.update(state => ({
      ...state,
      loading,
    }));
  }

  handleError(error: any): Observable<any> {
    this.setError('Erro ao carregar dados');
    console.error('Erro ao buscar dados:', error);
    return of(null);
  }

  setError(error: string | null) {
    this.state.update(state => ({
      ...state,
      error,
    }));
  }

  constructor() {}
}
