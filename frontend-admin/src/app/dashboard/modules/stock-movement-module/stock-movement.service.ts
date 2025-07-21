import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { Observable } from 'rxjs';
import { environments } from 'src/environments/environments';
import {
  IMovimentItem,
  StockMovementCreate,
} from 'app/shared/interfaces/stock-movement.interface';
import { Product } from 'app/shared/interfaces/product-module.interface';

@Injectable({
  providedIn: 'root',
})
export class StockMovementService {
  private http = inject(HttpClient);
  private apiUrl = environments.apiUrl + 'stock-movement';
  private productsApiUrl = environments.apiUrl + 'product';

  constructor() {}

  getAll(
    filter: { date: string; type: string },
    skipLoader: boolean
  ): Observable<ApiResponse<IMovimentItem[]>> {
    return this.http.get<ApiResponse<IMovimentItem[]>>(
      `${this.productsApiUrl}/getMovimentByDate`,
      {
        params: filter,
        headers: { 'Skip-Loader': skipLoader ? 'true' : 'false' },
      }
    );
  }

  getStockMetrics(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.productsApiUrl}/moviment/metrics`
    );
  }

  // Define methods for stock movement operations here
  createStockMovement(
    stockMovementData: StockMovementCreate
  ): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/create`,
      stockMovementData
    );
  }

  inboundProductsToStock(products: Product[]): Observable<ApiResponse> {
    const updatedProducts = products.map(({ id, quantity }) => ({
      id,
      quantity,
    }));
    return this.http.put<ApiResponse>(`${this.apiUrl}/inbound`, {
      products: updatedProducts,
    });
  }

  outboundProductsToStock(products: Product[]): Observable<ApiResponse> {
    const updatedProducts = products.map(({ id, quantity }) => ({
      id,
      quantity,
    }));
    return this.http.put<ApiResponse>(`${this.apiUrl}/outbound`, {
      products: updatedProducts,
    });
  }

  deleteStockMovement(stockMovementId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${stockMovementId}`);
  }
}
