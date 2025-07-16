import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { Observable } from 'rxjs';
import { environments } from 'src/environments/environments';
import {
  StockMovement,
  StockMovementCreate,
} from 'app/shared/interfaces/stock-movement.interface';

@Injectable({
  providedIn: 'root',
})
export class StockMovementService {
  private http = inject(HttpClient);
  private apiUrl = environments.apiUrl + 'stock-movement';
  private productsApiUrl = environments.apiUrl + 'products';

  constructor() {}

  getAll(
    filter: { date: string; type: string },
    skipLoader: boolean
  ): Observable<ApiResponse<StockMovement[]>> {
    return this.http.get<ApiResponse<StockMovement[]>>(`${this.productsApiUrl}/all`, {
      params: filter,
      headers: { 'Skip-Loader': skipLoader ? 'true' : 'false' },
    });
  }

  getStockMetrics(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.productsApiUrl}/metrics`);
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

  updateStockMovement(
    stockMovementData: StockMovement
  ): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(
      `${this.apiUrl}/update`,
      stockMovementData
    );
  }

  deleteStockMovement(stockMovementId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${stockMovementId}`);
  }
}
