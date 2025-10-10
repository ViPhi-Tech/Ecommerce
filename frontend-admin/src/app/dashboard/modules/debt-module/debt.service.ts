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
          "id": 104,
          "total": 519,
          "createdAt": "2025-10-09T01:22:42.729Z",
          "updatedAt": "2025-10-09T01:22:42.729Z",
          "status": "PENDING",
          "clientId": 7,
          "items": [
            {
              "id": 94,
              "orderId": 104,
              "productId": 83,
              "quantity": 1,
              "price": 519,
              "createdAt": "2025-10-09T01:22:42.984Z",
              "updatedAt": "2025-10-09T01:22:42.984Z"
            }
          ],
          "client": {
            "id": 7,
            "fullName": "Vinicius Soares",
            "document": "12195745975",
            "email": "vinicius.santana@fretefy.com.br",
            "phone": "41995716943",
            "isActive": true,
            "createdAt": "2025-07-12T20:23:38.679Z",
            "updatedAt": "2025-07-12T20:43:48.276Z",
            "loginId": null,
            "isResetPassword": false
          },
          "payments": [
            {
              "id": 77,
              "value": 319,
              "createdAt": "2025-10-09T01:22:44.270Z",
              "updatedAt": "2025-10-09T01:22:44.270Z",
              "orderId": 104,
              "statusId": "pending",
              "typeId": "credit"
            },
            {
              "id": 78,
              "value": 200,
              "createdAt": "2025-10-09T01:22:44.270Z",
              "updatedAt": "2025-10-09T01:22:44.270Z",
              "orderId": 104,
              "statusId": "pending",
              "typeId": "account-receivable"
            }
          ]
        },
        {
          "id": 103,
          "total": 519,
          "createdAt": "2025-10-09T00:57:53.797Z",
          "updatedAt": "2025-10-09T00:57:53.797Z",
          "status": "PENDING",
          "clientId": 7,
          "items": [
            {
              "id": 93,
              "orderId": 103,
              "productId": 83,
              "quantity": 1,
              "price": 519,
              "createdAt": "2025-10-09T00:57:54.046Z",
              "updatedAt": "2025-10-09T00:57:54.046Z"
            }
          ],
          "client": {
            "id": 7,
            "fullName": "Vinicius Soares",
            "document": "12195745975",
            "email": "vinicius.santana@fretefy.com.br",
            "phone": "41995716943",
            "isActive": true,
            "createdAt": "2025-07-12T20:23:38.679Z",
            "updatedAt": "2025-07-12T20:43:48.276Z",
            "loginId": null,
            "isResetPassword": false
          },
          "payments": [
            {
              "id": 76,
              "value": 519,
              "createdAt": "2025-10-09T00:57:55.288Z",
              "updatedAt": "2025-10-09T00:57:55.288Z",
              "orderId": 103,
              "statusId": "pending",
              "typeId": "pix"
            }
          ]
        }
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
