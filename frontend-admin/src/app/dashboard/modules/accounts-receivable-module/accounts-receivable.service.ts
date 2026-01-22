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

  constructor() {}

  getAll(
    skipLoader = true,
    filter?: {
      startDate?: string;
      endDate?: string;
    }
  ) {
    const headers: any = {};
    if (skipLoader) {
      headers['Skip-Loader'] = 'true';
    }
    const params: any = {};
    if (filter) {
      if (filter.startDate) {
        params.startDate = filter.startDate;
      }
      if (filter.endDate) {
        params.endDate = filter.endDate;
      }
    }
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/all`, {
      headers,
      params,
    });
  }

  getById(id: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/${id}`);
  }

  upsert(data: any): Observable<ApiResponse> {
    if (data.id) {
      return this.http.put<ApiResponse>(
        `${this.apiUrl}/update/${data.id}`,
        data
      );
    }
    return this.http.post<ApiResponse>(`${this.apiUrl}/create`, data);
  }

  delete(id: string, skipLoader?: boolean): Observable<ApiResponse> {
    const headers: any = {};
    if (skipLoader) {
      headers['Skip-Loader'] = 'true';
    }
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`, { headers });
  }

  updateAccountReceivableStatus(
    id: number,
    status: AccountsReceivableStatus,
    skipLoader = true
  ): Observable<ApiResponse> {
    const headers: any = {};
    if (skipLoader) {
      headers['Skip-Loader'] = 'true';
    }

    return this.http.patch<ApiResponse>(
      `${this.apiUrl}/update-status/${id}`,
      { status },
      { headers }
    );
  }
}
