import { computed, inject, Injectable, signal } from '@angular/core';
import {
  Product,
  ProductModuleState,
} from 'app/shared/interfaces/product-module.interface';
import { BaseState } from 'app/shared/store/base.state';
import { catchError, finalize, lastValueFrom, tap } from 'rxjs';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root',
})
export class ProductState extends BaseState<ProductModuleState> {
  private productService = inject(ProductService);

  protected state = signal<ProductModuleState>({
    productList: [],
    view:
      (localStorage.getItem('productView') as ProductModuleState['view']) ||
      'table',
    loading: false,
    error: null,
    orderFilter: '',
    searchTerm: '',
  });

  productList = computed(() => this.state().productList);
  currentView = computed(() => this.state().view);
  currentOrderFilter = computed(() => this.state().orderFilter);
  currentSearchTerm = computed(() => this.state().searchTerm);

  orderProductList = computed(() => {
    const state = this.state();
    const filter = state.orderFilter;
    const searchTerm = state.searchTerm;
    const productList = state.productList;

    let filteredProducts = [...productList];

    filteredProducts.sort((a, b) => {
      if (filter === 'low-price') {
        return a.finalPrice - b.finalPrice;
      } else if (filter === 'high-price') {
        return b.finalPrice - a.finalPrice;
      } else if (filter === 'az') {
        return a.name.localeCompare(b.name);
      } else if (filter === 'za') {
        return b.name.localeCompare(a.name);
      }
      return 0; // Default case, no sorting
    });

    if (searchTerm.trim()) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filteredProducts;
  });

  async getProductList(skipLoader = true): Promise<void> {
    this.setLoading(true);
    this.clearError();
    this.setProductList([]);

    await lastValueFrom(
      this.productService.getAll(skipLoader).pipe(
        tap((response: any) => {
          const products = Array.isArray(response) ? response : response.dados;
          if (products && products.length > 0) {
            this.setProductList(products);
          } else {
            this.setProductList([]);
            this.setError('Nenhum produto encontrado.');
          }
        }),
        catchError(error => this.handleError(error)),
        finalize(() => this.setLoading(false))
      )
    );
  }

  setProductList(productList: Product[]) {
    this.updateState('productList', productList);
  }

  setView(view: ProductModuleState['view']) {
    this.updateState('view', view);
    localStorage.setItem('productView', view);
  }

  setOrderFilter(filter: string) {
    this.updateState('orderFilter', filter);
  }

  setSearchTerm(searchTerm: string) {
    this.updateState('searchTerm', searchTerm);
  }

  constructor() {
    super();
  }
}
