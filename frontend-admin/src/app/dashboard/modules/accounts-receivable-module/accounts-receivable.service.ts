import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { Observable, of } from 'rxjs';
import { environments } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class AccountsReceivableService {
  private http = inject(HttpClient);
  private apiUrl = environments.apiUrl + 'accounts-receivable';

  refreshAccountsReceivableList$ = signal<any>(undefined);

  constructor() {}

  getAll(skipLoader = true) {
    return of({
      status: 'success',
      message: 'Lista de contas a pagar carregada com sucesso.',
      dados: [
        {
          id: '1',
          provider: 'Fornecedor 1',
          description: 'Descrição da conta 1',
          originalDueDate: '10/10/2023',
          issueDate: '01/10/2023',
          dueDate: '10/10/2023',
          competenceDate: '09/2023',
          recurringPurchase: false,
          amount: 100,
        },
        {
          id: '2',
          provider: 'Fornecedor 2',
          description: 'Descrição da conta 2',
          originalDueDate: '15/10/2023',
          issueDate: '05/10/2023',
          dueDate: '15/10/2023',
          competenceDate: '09/2023',
          recurringPurchase: true,
          amount: 200,
        },
      ],
    });
    // const headers: any = {};
    // if (skipLoader) {
    //   headers['Skip-Loader'] = 'true';
    // }
    // return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/all`, { headers });
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
    this.refreshAccountsReceivableList$.set(Math.random());
  }
}
