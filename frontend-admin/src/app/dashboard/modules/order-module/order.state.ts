import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, Observable, of } from 'rxjs';
import { environments } from 'src/environments/environments';
import { Order, OrderModuleState } from './interfaces/order.interface';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrderState {
  private http = inject(HttpClient);
  private apiUrl = environments.apiUrl;

  private state = signal<OrderModuleState>({
    orderList: [],
    view:
      (localStorage.getItem('orderView') as OrderModuleState['view']) ||
      'table',
    loading: false,
    error: null,
  });

  orderList = computed(() => this.state().orderList);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);
  currentView = computed(() => this.state().view);

  getOrderList(): void {
    this.setLoading(true);
    this.setError(null);
    this.setOrderList([]);

    lastValueFrom(
      this.http.get<Order[] | { data: Order[] }>(`${this.apiUrl}order/all`).pipe(
        catchError(error => this.handleError(error)),
        finalize(() => this.setLoading(false))
      )
    )
      .then(response => {
        
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

  setView(view: 'table' | 'list') {
    this.state.update(state => ({
      ...state,
      view,
    }));
    localStorage.setItem('orderView', view);
  }

  private setLoading(loading: boolean) {
    this.state.update(state => ({
      ...state,
      loading,
    }));
  }

  private handleError(error: any): Observable<Order[]> {
    this.setError('Erro ao carregar as categorias');
    console.error('Erro ao buscar categorias:', error);
    return of([]);
  }

  private setError(error: string | null) {
    this.state.update(state => ({
      ...state,
      error,
    }));
  }

  constructor() {}
}
