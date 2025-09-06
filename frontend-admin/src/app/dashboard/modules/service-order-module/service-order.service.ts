import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { IServiceOrder } from 'app/shared/interfaces/service-order/ServiceOrder';
import { Observable } from 'rxjs';
import { environments } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class ServiceOrderService {
  private http = inject(HttpClient);
  private apiUrl = environments.apiUrl + 'service-order';

  refreshServiceOrderList$ = signal<any>(undefined);

  constructor() {}

  getAll(skipLoader: boolean): Observable<ApiResponse<IServiceOrder[]>> {
    return this.http.get<ApiResponse<IServiceOrder[]>>(`${this.apiUrl}/all`, {
      headers: { 'Skip-Loader': skipLoader ? 'true' : 'false' },
    });
  }

  getServiceOrderById(serviceOrderId: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/${serviceOrderId}`);
  }

  upsertServiceOrder(serviceOrderData: any): Observable<ApiResponse> {
    if (serviceOrderData.id) {
      return this.http.put<ApiResponse>(
        `${this.apiUrl}/update`,
        serviceOrderData
      );
    }
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/create`,
      serviceOrderData
    );
  }

  deleteServiceOrder(serviceOrderId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${serviceOrderId}`);
  }

  filterServiceOrders(query: string): Observable<ApiResponse<IServiceOrder[]>> {
    return this.http.get<ApiResponse<IServiceOrder[]>>(
      `${this.apiUrl}/search/${query}`,
      {
        headers: { 'Skip-Loader': 'false' },
      }
    );
  }
}
