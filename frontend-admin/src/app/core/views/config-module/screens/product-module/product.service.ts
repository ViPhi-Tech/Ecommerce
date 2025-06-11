import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { Observable } from 'rxjs';
import { environments } from 'src/environments/environments';

@Injectable()
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = environments.apiUrl + '/products';

  constructor() {}

  // Define methods for product operations here
  createProduct(productData: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.apiUrl, productData);
  }
  
}
