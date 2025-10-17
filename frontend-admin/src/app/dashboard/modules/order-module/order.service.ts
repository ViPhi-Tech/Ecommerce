import { inject, Injectable } from '@angular/core';
import { Order } from './interfaces/order.interface';
import { environments } from 'src/environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = environments.apiUrl;
  private http = inject(HttpClient);

  constructor() {}

  getOrders(skipLoader = true): Observable<Order[] | { data: Order[] }> {
    const headers: any = {};
    if (skipLoader) {
      headers['Skip-Loader'] = 'true';
    }

    return this.http.get<Order[] | { data: Order[] }>(
      `${this.apiUrl}order/all`,
      { headers }
    );
  }

  getOrdersByClient(
    skipLoader = true,
    filter?: any
  ): Observable<Order[] | { data: Order[] }> {
    const headers: any = {};
    if (skipLoader) {
      headers['Skip-Loader'] = 'true';
    }
    const params: any = {};
    if (filter) {
      if (
        filter.clientId !== undefined &&
        filter.clientId !== null &&
        filter.clientId !== ''
      ) {
        params.clientId = filter.clientId;
      }
      if (filter.startDate) {
        params.startDate = filter.startDate;
      }
      if (filter.endDate) {
        params.endDate = filter.endDate;
      }
      if (filter.paymentTypeId) {
        params.paymentTypeId = filter.paymentTypeId;
      }
    }

    return this.http.get<Order[] | { data: Order[] }>(
      `${this.apiUrl}order/getOrdersByClient`,
      { headers, params }
    );
  }

  createOrder(data: any): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}order/create`, data);
  }

  createPreOrder(clientId: string | number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}order/create/preOrder`, {
      clientId,
    });
  }

  getOrderById(orderId: string | number): Observable<ApiResponse<Order>> {
    return this.http.get<ApiResponse<Order>>(`${this.apiUrl}order/${orderId}`);
  }

  deleteOrder(orderId: string | number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}order/${orderId}`);
  }
}
