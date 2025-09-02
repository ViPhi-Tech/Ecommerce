import { computed, inject, Injectable, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  IReportFilter,
  IReportType,
  ReportData,
} from 'app/shared/interfaces/report/report.interface';
import { ReportService } from './report.service';

@Injectable({
  providedIn: 'root',
})
export class ReportState {
  private reportService = inject(ReportService);

  // Signals
  loading = signal<boolean>(false);
  reportData = signal<ReportData[]>([]);
  currentFilter = signal<IReportFilter>({
    reportType: 'sales',
    periodType: 'current_month',
  });

  // Report types configuration
  reportTypes = signal<IReportType[]>([
    {
      id: 'sales',
      label: 'Relatório de Vendas',
      description: 'Relatório detalhado das vendas realizadas',
      columns: [
        {
          field: 'date',
          caption: 'Data',
          type: 'date',
          sortable: true,
          filter: true,
        },
        { field: 'client', caption: 'Cliente', sortable: true, filter: true },
        { field: 'product', caption: 'Produto', sortable: true, filter: true },
        {
          field: 'quantity',
          caption: 'Quantidade',
          type: 'number',
          sortable: true,
          filter: true,
        },
        {
          field: 'totalValue',
          caption: 'Valor Total',
          type: 'currency',
          sortable: true,
          filter: true,
        },
      ],
    },
    {
      id: 'stock',
      label: 'Relatório de Estoque',
      description: 'Situação atual do estoque de produtos',
      columns: [
        { field: 'product', caption: 'Produto', sortable: true, filter: true },
        {
          field: 'category',
          caption: 'Categoria',
          sortable: true,
          filter: true,
        },
        {
          field: 'currentQuantity',
          caption: 'Quantidade Atual',
          type: 'number',
          sortable: true,
          filter: true,
        },
        {
          field: 'lastMovement',
          caption: 'Última Movimentação',
          type: 'date',
          sortable: true,
          filter: true,
        },
      ],
    },
    {
      id: 'financial',
      label: 'Relatório Financeiro',
      description: 'Receitas e despesas do período',
      columns: [
        {
          field: 'date',
          caption: 'Data',
          type: 'date',
          sortable: true,
          filter: true,
        },
        {
          field: 'type',
          caption: 'Tipo',
          type: 'status',
          sortable: true,
          filter: true,
        },
        {
          field: 'value',
          caption: 'Valor',
          type: 'currency',
          sortable: true,
          filter: true,
        },
        {
          field: 'status',
          caption: 'Status',
          type: 'status',
          sortable: true,
          filter: true,
        },
        {
          field: 'notes',
          caption: 'Observações',
          sortable: false,
          filter: true,
        },
      ],
    },
    {
      id: 'clients',
      label: 'Relatório de Clientes',
      description: 'Lista de clientes cadastrados',
      columns: [
        { field: 'name', caption: 'Nome', sortable: true, filter: true },
        { field: 'email', caption: 'E-mail', sortable: true, filter: true },
        { field: 'phone', caption: 'Telefone', sortable: false, filter: true },
        {
          field: 'registrationDate',
          caption: 'Data de Cadastro',
          type: 'date',
          sortable: true,
          filter: true,
        },
        {
          field: 'status',
          caption: 'Status',
          type: 'status',
          sortable: true,
          filter: true,
        },
      ],
    },
  ]);

  // Period options
  periodOptions = signal([
    { label: 'Mês atual', value: 'current_month' },
    { label: 'Últimos 7 dias', value: 'last_7_days' },
    { label: 'Últimos 15 dias', value: 'last_15_days' },
    { label: 'Últimos 30 dias', value: 'last_30_days' },
    { label: 'Período personalizado', value: 'custom' },
  ]);

  // Computed values
  currentReportType = computed(() => {
    const currentType = this.currentFilter().reportType;
    return this.reportTypes().find(type => type.id === currentType);
  });

  constructor() {}

  // Actions
  setFilter(filter: Partial<IReportFilter>) {
    this.currentFilter.update(current => ({ ...current, ...filter }));
    this.loadReportData();
  }

  async loadReportData() {
    this.loading.set(true);

    await lastValueFrom(
      this.reportService.getReportData(this.currentFilter()).pipe(
        tap((response: any) => {
          const reportData = Array.isArray(response) ? response : response.data;
          if (reportData && reportData.length > 0) {
            this.reportData.set(reportData);
          } else {
            this.reportData.set([]);
          }
        }),
        catchError(() => {
          this.reportData.set([]);
          return of([]);
        }),
        finalize(() => this.loading.set(false))
      )
    );
  }

  exportReport(format: 'pdf' | 'excel') {
    return this.reportService.exportReport(this.currentFilter(), format);
  }
}
