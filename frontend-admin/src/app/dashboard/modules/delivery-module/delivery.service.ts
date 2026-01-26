import { inject, Injectable } from '@angular/core';
import { Delivery, DeliveryRoute } from './interfaces/delivery.interface';
import { environments } from 'src/environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  private apiUrl = environments.apiUrl;
  private http = inject(HttpClient);

  constructor() {}

  getDeliveries(
    skipLoader = true
  ): Observable<Delivery[] | { data: Delivery[] }> {
    const headers: Record<string, string> = {};
    if (skipLoader) {
      headers['Skip-Loader'] = 'true';
    }

    return this.http.get<Delivery[] | { data: Delivery[] }>(
      `${this.apiUrl}delivery/all`,
      { headers }
    );
  }

  getDeliveryById(
    deliveryId: string | number
  ): Observable<ApiResponse<Delivery>> {
    return this.http.get<ApiResponse<Delivery>>(
      `${this.apiUrl}delivery/${deliveryId}`
    );
  }

  createDelivery(data: Partial<Delivery>): Observable<ApiResponse<Delivery>> {
    return this.http.post<ApiResponse<Delivery>>(
      `${this.apiUrl}delivery/create`,
      data
    );
  }

  updateDelivery(
    deliveryId: string | number,
    data: Partial<Delivery>
  ): Observable<ApiResponse<Delivery>> {
    return this.http.put<ApiResponse<Delivery>>(
      `${this.apiUrl}delivery/${deliveryId}`,
      data
    );
  }

  deleteDelivery(
    deliveryId: string | number
  ): Observable<ApiResponse<unknown>> {
    return this.http.delete<ApiResponse<unknown>>(
      `${this.apiUrl}delivery/${deliveryId}`
    );
  }

  generateRoute(
    deliveryId: string | number
  ): Observable<ApiResponse<DeliveryRoute>> {
    return this.http.post<ApiResponse<DeliveryRoute>>(
      `${this.apiUrl}delivery/${deliveryId}/generate-route`,
      {}
    );
  }

  optimizeRoute(
    deliveryId: string | number
  ): Observable<ApiResponse<DeliveryRoute>> {
    return this.http.post<ApiResponse<DeliveryRoute>>(
      `${this.apiUrl}delivery/${deliveryId}/optimize-route`,
      {}
    );
  }

  updateDeliveryStatus(
    deliveryId: string | number,
    status: string
  ): Observable<ApiResponse<Delivery>> {
    return this.http.patch<ApiResponse<Delivery>>(
      `${this.apiUrl}delivery/${deliveryId}/status`,
      { status }
    );
  }

  cancelDelivery(
    uuid: string
  ): Observable<ApiResponse<Delivery>> {
    console.log('DeliveryService.cancelDelivery - UUID recebido:', uuid);
    console.log('DeliveryService.cancelDelivery - URL:', `${this.apiUrl}delivery/${uuid}/cancel`);
    return this.http.patch<ApiResponse<Delivery>>(
      `${this.apiUrl}delivery/${uuid}/cancel`,
      {}
    );
  }

  completeDelivery(
    uuid: string
  ): Observable<ApiResponse<Delivery>> {
    return this.http.patch<ApiResponse<Delivery>>(
      `${this.apiUrl}delivery/${uuid}/complete`,
      {}
    );
  }
}
