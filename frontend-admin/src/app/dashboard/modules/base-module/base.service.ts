import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { Observable } from 'rxjs';
import { environments } from 'src/environments/environments';
import { Base } from './base.state';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  private http = inject(HttpClient);
  private apiUrl = environments.apiUrl + 'base';

  refreshBaseList$ = signal<any>(undefined);

  constructor() {}

  getAll() {
    return this.http.get<ApiResponse<Base[]>>(`${this.apiUrl}/all`);
  }

  getBaseById(baseId: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/${baseId}`);
  }

  // Define methods for base operations here
  upsertBase(baseData: any): Observable<ApiResponse> {
    if (baseData.id) {
      // Update existing base
      return this.http.put<ApiResponse>(`${this.apiUrl}/update`, baseData);
    }
    // Create new base
    return this.http.post<ApiResponse>(`${this.apiUrl}/create`, baseData);
  }

  deleteBase(baseId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${baseId}`);
  }

  refreshBaseList() {
    this.refreshBaseList$.set(Math.random());
  }
}
