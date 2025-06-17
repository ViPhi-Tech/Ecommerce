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

  default = [
    {
      id: 1,
      customerName: 'João Silva',
      totalAmount: 150.0,
      status: 'Pendente',
      createdAt: new Date('2023-10-01'),
      updatedAt: new Date('2023-10-01'),
      isActive: true,
    },
    {
      id: 2,
      customerName: 'Maria Oliveira',
      totalAmount: 200.0,
      status: 'Concluído',
      createdAt: new Date('2023-10-02'),
      updatedAt: new Date('2023-10-02'),
      isActive: true,
    },
  ];

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
    this.setOrderList([...this.default]); // Set default data initially

    lastValueFrom(
      this.http.get<Order[]>(`${this.apiUrl}orders`).pipe(
        catchError(error => this.handleError(error)),
        finalize(() => this.setLoading(false))
      )
    )
      .then(orders => {
        this.setOrderList(orders && orders.length ? orders : [...this.default]);
      })
      .catch(error => {
        this.setError('Erro ao carregar a lista de pedidos');
        console.error('Erro ao buscar pedidos:', error);
      });
  }

  setOrderList(orderList: Order[]) {
    this.state.update(state => ({
      ...state,
      orderList,
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
