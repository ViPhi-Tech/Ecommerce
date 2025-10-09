import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { IDebt } from 'app/shared/interfaces/debt/Debt';
import { Observable } from 'rxjs';
import { environments } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class DebtService {
  private http = inject(HttpClient);
  private apiUrl = environments.apiUrl + 'debt';

  refreshDebtList$ = signal<any>(undefined);

  constructor() {}

  getAll(skipLoader: boolean): Observable<ApiResponse<IDebt[]>> {
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

  filterDebts(query: string): Observable<ApiResponse<IDebt[]>> {
    return this.http.get<ApiResponse<IDebt[]>>(
      `${this.apiUrl}/search/${query}`,
      {
        headers: { 'Skip-Loader': 'false' },
      }
    );
  }

  markAsPaid(debtId: string): Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(`${this.apiUrl}/${debtId}/pay`, {});
  }

  refreshDebtList() {
    this.refreshDebtList$.set(Math.random());
  }
}
