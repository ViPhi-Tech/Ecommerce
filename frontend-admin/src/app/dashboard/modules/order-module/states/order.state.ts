import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, Observable, of, tap } from 'rxjs';
import { environments } from 'src/environments/environments';
import { Order, OrderModuleState } from '../interfaces/order.interface';

@Injectable()
export class OrderState {
  private http = inject(HttpClient);
  private apiUrl = environments.apiUrl;

  private state = signal<OrderModuleState>({
    orderList: [],
    loading: false,
    error: null,
  });

  orderList = computed(() => this.state().orderList);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);

  getOrderList(): void {
    this.setLoading(true);
    this.setError(null);
    this.setOrderList([]);

    this.http
      .get<Order[]>(`${this.apiUrl}orders`)
      .pipe(
        tap(categories => this.setOrderList(categories)),
        catchError(error => this.handleError(error)),
        finalize(() => this.setLoading(false))
      )
      .subscribe();
  }

  setOrderList(categoryList: any) {
    this.state.update(state => ({
      ...state,
      categoryList,
    }));
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
