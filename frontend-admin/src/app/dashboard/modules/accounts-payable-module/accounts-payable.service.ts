import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IAccountsPayable } from 'app/shared/interfaces/accounts-payable/AccountsPayable';
import { AccountsPayableStatus } from 'app/shared/interfaces/accounts-payable/AccountsPayableStatus';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { Observable } from 'rxjs';
import { environments } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class AccountsPayableService {
  private http = inject(HttpClient);
  private apiUrl = environments.apiUrl + 'accounts-payable';

  constructor() {}

  getAll(skipLoader = true) {
    const headers: any = {};
    if (skipLoader) {
      headers['Skip-Loader'] = 'true';
    }

    return this.http.get<ApiResponse<IAccountsPayable[]>>(
      `${this.apiUrl}/all`,
      {
        headers,
      }
    );
  }

  getById(id: number): Observable<ApiResponse<IAccountsPayable>> {
    return this.http.get<ApiResponse<IAccountsPayable>>(`${this.apiUrl}/${id}`);
  }

  upsert(data: IAccountsPayable): Observable<ApiResponse> {
    if (data.id) {
      return this.http.put<ApiResponse>(
        `${this.apiUrl}/update/${data.id}`,
        data
      );
    }
    return this.http.post<ApiResponse>(`${this.apiUrl}/create`, data);
  }

  delete(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`);
  }

  markAsPaid(id: number): Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(
      `${this.apiUrl}/mark-as-paid/${id}`,
      {}
    );
  }

  updateAccountPayableStatus(
    id: number,
    status: AccountsPayableStatus
  ): Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(`${this.apiUrl}/update-status/${id}`, {
      status,
    });
  }
}
