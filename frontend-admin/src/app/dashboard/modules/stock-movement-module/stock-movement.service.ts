import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { Observable, Subject } from 'rxjs';
import { environments } from 'src/environments/environments';
import { MovimentManyStocks } from './interfaces/stock-moviment.interface';
import { IMovimentItem } from 'app/shared/interfaces/stock/IMovimentItem';
import { IStockMovementCreate } from 'app/shared/interfaces/stock/StockMovementCreate';
import { IProduct } from 'app/shared/interfaces/product/Product';

@Injectable({
  providedIn: 'root',
})
export class StockMovementService {
  private http = inject(HttpClient);
  private apiUrl = environments.apiUrl + 'stock-movement';
  private productsApiUrl = environments.apiUrl + 'product';

  private refreshStock = new Subject<void>();
  refreshStock$ = this.refreshStock.asObservable();

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

  getStockMetrics(skipLoader = true): Observable<ApiResponse<any>> {
    const headers: any = {};
    if (skipLoader) {
      headers['Skip-Loader'] = 'true';
    }

    return this.http.get<ApiResponse<any>>(
      `${this.productsApiUrl}/moviment/metrics`,
      { headers }
    );
  }

  // Define methods for stock movement operations here
  createStockMovement(
    stockMovementData: IStockMovementCreate
  ): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/create`,
      stockMovementData
    );
  }

  updateProductStock(
    products: IProduct[],
    type: 'IN' | 'OUT'
  ): Observable<ApiResponse> {
    const outboundData: MovimentManyStocks = this.formatStockMovementData(
      products,
      type
    );

    return this.http.post<ApiResponse>(
      `${this.productsApiUrl}/movimentManyStocks`,
      outboundData
    );
  }

  formatStockMovementData(
    products: IProduct[],
    type: 'IN' | 'OUT'
  ): MovimentManyStocks {
    const updatedProducts = products.map(({ id, quantity }) => ({
      productId: id,
      quantity,
    }));

    return {
      type,
      stocks: updatedProducts,
    };
  }

  refreshStockData() {
    this.refreshStock.next();
  }

  deleteStockMovement(stockMovementId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      `${this.apiUrl}/delete/${stockMovementId}`
    );
  }
}
