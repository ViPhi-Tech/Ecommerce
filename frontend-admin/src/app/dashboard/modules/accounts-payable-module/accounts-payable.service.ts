import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IAccountsPayable } from 'app/shared/interfaces/accounts-payable/AccountsPayable';
import { AccountsPayableStatus } from 'app/shared/interfaces/accounts-payable/AccountsPayableStatus';
import type { AccountsPayableListStatusParam } from 'app/shared/interfaces/accounts-payable/accounts-payable-list-query';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import dayjs from 'dayjs';
import { Observable } from 'rxjs';
import { environments } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class AccountsPayableService {
  private http = inject(HttpClient);
  private apiUrl = environments.apiUrl + 'accounts-payable';

  constructor() {}

  /**
   * @param dueRange Filtra `dueDate` inclusivo no servidor.
   * @param status Filtra pelo status persistido no banco (`all` ou omitido = sem filtro).
   */
  getAll(
    skipLoader = true,
    dueRange?: { startDate: Date; endDate: Date },
    status?: AccountsPayableListStatusParam
  ): Observable<ApiResponse<IAccountsPayable[]>> {
    const headers: Record<string, string> = {};
    if (skipLoader) {
      headers['Skip-Loader'] = 'true';
    }

    let params = new HttpParams();
    if (dueRange) {
      params = params
        .set('dueDateFrom', dayjs(dueRange.startDate).format('YYYY-MM-DD'))
        .set('dueDateTo', dayjs(dueRange.endDate).format('YYYY-MM-DD'));
    }
    if (status !== undefined && status !== 'all') {
      params = params.set('status', status);
    }

    return this.http.get<ApiResponse<IAccountsPayable[]>>(
      `${this.apiUrl}/all`,
      { headers, params }
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
    status: AccountsPayableStatus,
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
