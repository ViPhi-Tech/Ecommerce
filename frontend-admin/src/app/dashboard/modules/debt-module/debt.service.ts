import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { IDebt } from 'app/shared/interfaces/debt/Debt';
import { Observable, of } from 'rxjs';
import { environments } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class DebtService {
  private http = inject(HttpClient);
  private apiUrl = environments.apiUrl + 'debt';

  refreshDebtList$ = signal<any>(undefined);

  constructor() {}

  getAll(skipLoader: boolean): Observable<any> {
    return of({
      data: [
        {
          id: '1',
          title: 'Dívida 1',
          amount: 100,
          dueDate: '2025-01-01',
          status: 'pending',
          createdAt: '2025-01-01',
          updatedAt: '2025-01-01',
        },
        {
          id: '2',
          title: 'Dívida 2',
          amount: 200,
          dueDate: '2025-01-02',
          status: 'pending',
          createdAt: '2025-01-02',
          updatedAt: '2025-01-02',
        },
      ],
      message: 'Dívidas carregadas com sucesso',
      status: 200,
    });
    return this.http.get<ApiResponse<IDebt[]>>(`${this.apiUrl}/all`, {
      headers: { 'Skip-Loader': skipLoader ? 'true' : 'false' },
    });
  }

  getDebtById(debtId: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/${debtId}`);
  }

  upsertDebt(debtData: any): Observable<ApiResponse> {
    if (debtData.id) {
      // Atualizar dívida existente
      return this.http.put<ApiResponse>(`${this.apiUrl}/update`, debtData);
    }
    // Criar nova dívida
    return this.http.post<ApiResponse>(`${this.apiUrl}/create`, debtData);
  }

  deleteDebt(debtId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${debtId}`);
  }
}
