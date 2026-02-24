import { computed, inject, Injectable, signal } from '@angular/core';
import { BaseState } from 'app/shared/store/base.state';
import { catchError, lastValueFrom, tap } from 'rxjs';
import { HomeService } from './home.service';
import {
  DashboardCharts,
  DashboardMetrics,
  HomeModuleState,
} from 'app/shared/interfaces/home/HomeModuleState';
import dayjs from 'dayjs';

@Injectable({
  providedIn: 'root',
})
export class HomeState extends BaseState<HomeModuleState> {
  private homeService = inject(HomeService);

  protected state = signal<HomeModuleState>({
    indicators: {
      totalOrders: 0,
      totalProductsWithStock: 0,
      totalSales: 0,
      activeClients: 0,
    },
    charts: {
      salesByMonth: [],
      topProducts: [],
      orderStatus: [],
      salesByCategory: [],
    },
    date: {
      startDate: dayjs().format('YYYY-MM-DD'),
      endDate: dayjs().format('YYYY-MM-DD'),
    },
    loading: false,
    error: null,
  });

  indicators = computed(() => this.state().indicators);
  charts = computed(() => this.state().charts);

  async getDashboardMetrics(skipLoader = true): Promise<void> {
    try {
      await lastValueFrom(
        this.homeService
          .getDashboardMetrics(this.state().date, skipLoader)
          .pipe(
            tap((response: any) => {
              const metrics = Array.isArray(response)
                ? response[0]
                : response.dados || response;
              if (metrics) {
                this.setDashboardMetrics(metrics);
              } else {
                this.setError('Nenhum dado encontrado.');
              }
            }),
            catchError(error => this.handleError(error))
          )
      );
    } catch {
      this.setError('Erro ao carregar métricas do dashboard.');
    }
  }

  async getDashboardCharts(skipLoader = true): Promise<void> {
    try {
      await lastValueFrom(
        this.homeService
          .getDashboardCharts(this.state().date, skipLoader)
          .pipe(
            tap((response: any) => {
              const metrics = Array.isArray(response)
                ? response[0]
                : response.dados || response;
              if (metrics) {
                this.setCharts(metrics);
              } else {
                this.setError('Nenhum dado encontrado.');
              }
            }),
            catchError(error => this.handleError(error))
          )
      );
    } catch {
      this.setError('Erro ao carregar gráficos do dashboard.');
    }
  }

  async loadAllMetrics(skipLoader = true): Promise<void> {
    this.setLoading(true);
    this.clearError();

    try {
      await Promise.all([
        this.getDashboardMetrics(skipLoader),
        this.getDashboardCharts(skipLoader),
      ]);
    } catch {
      this.setError('Erro ao carregar dados do dashboard.');
    } finally {
      this.setLoading(false);
    }
  }

  setDashboardMetrics(metrics: DashboardMetrics) {
    this.updateState('indicators', metrics);
  }

  setCharts(metrics: DashboardCharts) {
    debugger;
    const charts: DashboardCharts = {
      salesByMonth: metrics.salesByMonth,
      topProducts: metrics.topProducts,
      orderStatus: metrics.orderStatus.map(item => ({
        name: this.fromToStatus(item.name),
        total: item.total,
      })),
      salesByCategory: metrics.salesByCategory,
    };
    this.updateState('charts', charts);
  }

  fromToStatus(status: string) {
    const statusMap = {
      'PENDING': 'Pendente',
      'PROCESSING': 'Processando',
      'SENT': 'Enviado',
      'DELIVERED': 'Entregue',
      'CANCELLED': 'Cancelado',
      'COMPLETED': 'Finalizado',
    };
    return statusMap[status as keyof typeof statusMap];
  }

  setDateFilter(period: HomeModuleState['date']) {
    this.updateState('date', period);
    // Recarregar dados quando o período mudar
    this.loadAllMetrics(true);
  }

  constructor() {
    super();
  }
}
