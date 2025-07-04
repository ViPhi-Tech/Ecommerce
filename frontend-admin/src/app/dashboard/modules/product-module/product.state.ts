import { computed, inject, Injectable, signal } from '@angular/core';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import {
  Product,
  ProductModuleState,
} from 'app/shared/interfaces/product-module.interface';
import { BaseState } from 'app/shared/store/base.state';
import { catchError, finalize, lastValueFrom } from 'rxjs';
import { environments } from 'src/environments/environments';
import { ProductService } from './product.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductState extends BaseState<ProductModuleState> {
  private productService = inject(ProductService);
  private http = inject(HttpClient);
  private apiUrl = environments.apiUrl;

  protected state = signal<ProductModuleState>({
    productList: [],
    view:
      (localStorage.getItem('productView') as ProductModuleState['view']) ||
      'table',
    loading: false,
    error: null,
  });

  productList = computed(() => this.state().productList);
  currentView = computed(() => this.state().view);

  async getProductList(): Promise<void> {
    this.setLoading(true);
    this.clearError();
    this.setProductList([]);

    await lastValueFrom(
      this.http
        .get<ApiResponse<Product[]>>(`${this.apiUrl}product/all`, {
          headers: { 'Skip-Loader': 'true' },
        })
        .pipe(
          catchError(error => this.handleError(error)),
          finalize(() => this.setLoading(false))
        )
    )
      .then((response: any) => {
        const products = Array.isArray(response) ? response : response.dados;
        if (products && products.length > 0) {
          this.setProductList(products);
        } else {
          this.setProductList([]);
          this.setError('Nenhum produto encontrado.');
        }
      })
      .catch(error => {
        this.setError('Erro ao carregar a lista de produtos');
        console.error('Erro ao buscar produtos:', error);
      });
  }

  setProductList(productList: Product[]) {
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

  constructor() {
    super();
  }
}
