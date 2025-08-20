import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { Observable, of } from 'rxjs';
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

  getAll(skipLoader = true) {
    return of({
      status: 'success',
      message: 'Lista de contas a receber carregada com sucesso.',
      dados: [
        {
          id: 1,
          uuid: 'acc-rec-001',
          clientId: 1,
          client: {
            id: '1',
            fullName: 'João Silva',
            email: 'joao@email.com',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          description: 'Venda de produtos - Pedido #001',
          originalDueDate: new Date('2024-12-10'),
          issueDate: new Date('2024-11-10'),
          dueDate: new Date('2024-12-10'),
          competenceDate: new Date('2024-11-01'),
          recurringIncome: false,
          amount: 1500.0,
          status: 'pending' as AccountsReceivableStatus,
          statusLabel: 'Pendente',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          uuid: 'acc-rec-002',
          clientId: 2,
          client: {
            id: '2',
            fullName: 'Maria Santos',
            email: 'maria@email.com',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          description: 'Serviços de consultoria',
          originalDueDate: new Date('2024-12-05'),
          issueDate: new Date('2024-11-05'),
          dueDate: new Date('2024-12-05'),
          competenceDate: new Date('2024-11-01'),
          recurringIncome: true,
          amount: 2000.0,
          status: 'due_soon' as AccountsReceivableStatus,
          statusLabel: 'Vence em Breve',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          uuid: 'acc-rec-003',
          clientId: 3,
          client: {
            id: '3',
            fullName: 'Pedro Costa',
            email: 'pedro@email.com',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          description: 'Venda de equipamentos',
          originalDueDate: new Date('2024-11-15'),
          issueDate: new Date('2024-10-15'),
          dueDate: new Date('2024-11-15'),
          competenceDate: new Date('2024-10-01'),
          recurringIncome: false,
          amount: 5000.0,
          status: 'overdue' as AccountsReceivableStatus,
          statusLabel: 'Vencido',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          uuid: 'acc-rec-004',
          clientId: 4,
          client: {
            id: '4',
            fullName: 'Ana Lima',
            email: 'ana@email.com',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          description: 'Licença de software',
          originalDueDate: new Date('2024-10-30'),
          issueDate: new Date('2024-10-01'),
          dueDate: new Date('2024-10-30'),
          competenceDate: new Date('2024-10-01'),
          recurringIncome: true,
          amount: 800.0,
          status: 'received' as AccountsReceivableStatus,
          statusLabel: 'Recebido',
          createdAt: new Date(),
          updatedAt: new Date(),
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

  updateAccountReceivableStatus(
    id: number,
    status: AccountsReceivableStatus
  ): Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(`${this.apiUrl}/${id}/status`, {
      status,
    });
  }

  refreshList() {
    this.refreshAccountsReceivableList$.set(Math.random());
  }
}
