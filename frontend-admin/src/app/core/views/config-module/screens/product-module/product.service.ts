import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { Observable } from 'rxjs';
import { environments } from 'src/environments/environments';

@Injectable()
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = environments.apiUrl + 'product';

  refreshProductList$ = signal<any>(undefined);

  constructor() {}

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

  refreshProductList() {
    this.refreshProductList$.set(Math.random());
  }
}
