import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { IProduct } from 'app/shared/interfaces/product/Product';
import { Observable } from 'rxjs';
import { environments } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = environments.apiUrl + 'product';

  refreshProductList$ = signal<any>(undefined);

  constructor() {}

  getAll(skipLoader: boolean): Observable<ApiResponse<IProduct[]>> {
    return this.http.get<ApiResponse<IProduct[]>>(`${this.apiUrl}/all`, {
      headers: { 'Skip-Loader': skipLoader ? 'true' : 'false' },
    });
  }

  getProductById(productId: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/${productId}`);
  }

  // Define methods for product operations here
  upsertProduct(productData: any): Observable<ApiResponse> {
    if (productData.id) {
      // Update existing product
      return this.http.put<ApiResponse>(`${this.apiUrl}/update`, productData);
    }
    // Create new product
    return this.http.post<ApiResponse>(`${this.apiUrl}/create`, productData);
  }

  deleteProduct(productId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${productId}`);
  }

  filterProducts(query: string): Observable<ApiResponse<IProduct[]>> {
    return this.http.get<ApiResponse<IProduct[]>>(
      `${this.apiUrl}/search/${query}`,
      {
        headers: { 'Skip-Loader': 'false' },
      }
    );
  }

  refreshProductList() {
    this.refreshProductList$.set(Math.random());
  }

  validateImportProducts(products: any[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/validateImportProducts`,
      { products }
    );
  }
}
