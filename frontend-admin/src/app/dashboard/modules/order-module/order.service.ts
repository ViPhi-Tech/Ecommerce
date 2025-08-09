import { inject, Injectable } from '@angular/core';
import { Order } from './interfaces/order.interface';
import { environments } from 'src/environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  createOrder(data: any): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}order/create`, data);
  }

  createPreOrder(clientId: string | number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}order/create/preOrder`, {
      clientId,
    });
  }

  getOrderById(orderId: string | number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}order/${orderId}`);
  }
}
