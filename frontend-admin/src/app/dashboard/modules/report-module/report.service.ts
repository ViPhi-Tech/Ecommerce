import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import {
  IReportFilter,
  ReportData,
} from 'app/shared/interfaces/report/report.interface';
import { Observable, of } from 'rxjs';
import { environments } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private http = inject(HttpClient);
  private apiUrl = environments.apiUrl + 'reports';

  refreshReportData$ = signal<any>(undefined);

  constructor() {}

  getReportData(filter: IReportFilter): Observable<ApiResponse<ReportData[]>> {
    // Mock data for demonstration - replace with actual API call
    return this.generateMockData(filter);
  }

  exportReport(
    filter: IReportFilter,
    format: 'pdf' | 'excel'
  ): Observable<Blob> {
    return this.http.post(
      `${this.apiUrl}/export`,
      { filter, format },
      {
        responseType: 'blob',
      }
    );
  }

  refreshReportData() {
    this.refreshReportData$.set(Math.random());
  }

  private generateMockData(
    filter: IReportFilter
  ): Observable<ApiResponse<ReportData[]>> {
    let mockData: ReportData[] = [];

    switch (filter.reportType) {
      case 'sales':
        mockData = [
          {
            id: '1',
            date: '2025-01-15',
            client: 'João Silva',
            product: 'Smartphone Galaxy',
            quantity: 2,
            totalValue: 2500.0,
          },
          {
            id: '2',
            date: '2025-01-14',
            client: 'Maria Santos',
            product: 'Notebook Dell',
            quantity: 1,
            totalValue: 3200.0,
          },
          {
            id: '3',
            date: '2025-01-13',
            client: 'Pedro Costa',
            product: 'Mouse Gamer',
            quantity: 3,
            totalValue: 450.0,
          },
        ];
        break;

      case 'stock':
        mockData = [
          {
            id: '1',
            product: 'Smartphone Galaxy',
            category: 'Eletrônicos',
            currentQuantity: 25,
            lastMovement: '2025-01-15',
          },
          {
            id: '2',
            product: 'Notebook Dell',
            category: 'Informática',
            currentQuantity: 12,
            lastMovement: '2025-01-14',
          },
          {
            id: '3',
            product: 'Mouse Gamer',
            category: 'Acessórios',
            currentQuantity: 50,
            lastMovement: '2025-01-13',
          },
        ];
        break;

      case 'financial':
        mockData = [
          {
            id: '1',
            date: '2025-01-15',
            type: 'receita',
            value: 2500.0,
            status: 'pago',
            notes: 'Venda smartphone',
          },
          {
            id: '2',
            date: '2025-01-14',
            type: 'despesa',
            value: 800.0,
            status: 'pendente',
            notes: 'Fornecedor XYZ',
          },
          {
            id: '3',
            date: '2025-01-13',
            type: 'receita',
            value: 3200.0,
            status: 'pago',
            notes: 'Venda notebook',
          },
        ];
        break;

      case 'clients':
        mockData = [
          {
            id: '1',
            name: 'João Silva',
            email: 'joao@email.com',
            phone: '(11) 99999-9999',
            registrationDate: '2024-12-01',
            status: 'ativo',
          },
          {
            id: '2',
            name: 'Maria Santos',
            email: 'maria@email.com',
            phone: '(11) 88888-8888',
            registrationDate: '2024-11-15',
            status: 'ativo',
          },
          {
            id: '3',
            name: 'Pedro Costa',
            email: 'pedro@email.com',
            phone: '(11) 77777-7777',
            registrationDate: '2024-10-20',
            status: 'inativo',
          },
        ];
        break;
    }

    return of({
      status: true,
      data: mockData,
      dados: mockData,
      message: 'Dados carregados com sucesso',
    });
  }
}
