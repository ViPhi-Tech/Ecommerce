import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { Observable } from 'rxjs';
import { environments } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class AccountsPayableService {
  private http = inject(HttpClient);
  private apiUrl = environments.apiUrl + 'accounts-payable';

  refreshAccountsPayableList$ = signal<any>(undefined);

  constructor() {}

  getAll() {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/all`);
  }

  getById(id: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/${id}`);
  }

  upsert(data: any): Observable<ApiResponse> {
    if (data.id) {
      return this.http.put<ApiResponse>(`${this.apiUrl}/update`, data);
    }
    return this.http.post<ApiResponse>(`${this.apiUrl}/create`, data);
  }

  delete(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`);
  }

  refreshList() {
    this.refreshAccountsPayableList$.set(Math.random());
  }
}
