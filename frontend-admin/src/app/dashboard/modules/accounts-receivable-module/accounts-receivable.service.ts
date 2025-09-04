import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { Observable } from 'rxjs';
import { environments } from 'src/environments/environments';
import { AccountsReceivableStatus } from 'app/shared/interfaces/accounts-receivable/AccountsReceivableStatus';

@Injectable({
  providedIn: 'root',
})
export class AccountsReceivableService {
  private http = inject(HttpClient);
  private apiUrl = environments.apiUrl + 'accounts-receivable';

  refreshAccountsReceivableList$ = signal<any>(undefined);

  constructor() { }

  getAll(skipLoader = true) {
    const headers: any = {};
    if (skipLoader) {
      headers['Skip-Loader'] = 'true';
    }
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/all`, { headers });
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

  updateAccountReceivableStatus(
    id: number,
    status: AccountsReceivableStatus
  ): Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(`${this.apiUrl}/${id}/status`, {
      status,
    });
  }

  markAsReceived(id: number): Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(
      `${this.apiUrl}/mark-as-received/${id}`,
      {}
    );
  }

  refreshList() {
    this.refreshAccountsReceivableList$.set(Math.random());
  }
}
