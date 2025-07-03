import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import {
  Product,
  ProductModuleState,
} from 'app/shared/interfaces/product-module.interface';
import { catchError, finalize, Observable, of, tap } from 'rxjs';
import { environments } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class ProductState {
  private http = inject(HttpClient);
  private apiUrl = environments.apiUrl;

  private state = signal<ProductModuleState>({
    productList: [],
    view:
      (localStorage.getItem('productView') as ProductModuleState['view']) ||
      'table',
    loading: false,
    error: null,
  });

  productList = computed(() => this.state().productList);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);
  currentView = computed(() => this.state().view);

  getProductList(): void {
    this.setLoading(true);
    this.setError(null);
    this.setProductList([]);

    this.http
      .get<ApiResponse<Product[]>>(`${this.apiUrl}product/all`, {
        headers: { 'Skip-Loader': 'true' },
      })
      .pipe(
        tap(data => this.setProductList(data.dados)),
        catchError(error => this.handleError(error)),
        finalize(() => this.setLoading(false))
      )
      .subscribe();
  }

  setProductList(productList: any) {
    this.state.update(state => ({
      ...state,
      productList,
    }));
  }

  setView(view: ProductModuleState['view']) {
    this.state.update(state => ({
      ...state,
      view,
    }));
    localStorage.setItem('productView', view);
  }

  private setLoading(loading: boolean) {
    this.state.update(state => ({
      ...state,
      loading,
    }));
  }

  private handleError(error: any): Observable<Product[]> {
    this.setError('Erro ao carregar os produtos');
    console.error('Erro ao buscar produtos:', error);
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
