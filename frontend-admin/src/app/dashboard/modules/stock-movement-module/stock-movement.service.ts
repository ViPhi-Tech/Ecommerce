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

  constructor() {}

  getAll(
    filter: { date: string; type: string },
    skipLoader: boolean
  ): Observable<ApiResponse<StockMovement[]>> {
    return this.http.get<ApiResponse<StockMovement[]>>(`${this.apiUrl}/all`, {
      params: filter,
      headers: { 'Skip-Loader': skipLoader ? 'true' : 'false' },
    });
  }

  getStockMovementById(stockMovementId: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/${stockMovementId}`);
  }

  getStockMovementsByProduct(
    productId: string
  ): Observable<ApiResponse<StockMovement[]>> {
    return this.http.get<ApiResponse<StockMovement[]>>(
      `${this.apiUrl}/product/${productId}`
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
