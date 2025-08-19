import { computed, inject, Injectable, signal } from '@angular/core';
import { BaseState } from 'app/shared/store/base.state';
import { catchError, finalize, lastValueFrom, tap } from 'rxjs';
import { HomeService } from './home.service';
import {
  ChartsMetrics,
  DashboardMetrics,
  HomeModuleState,
} from 'app/shared/interfaces/home/HomeModuleState';

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
      activeClients: 0
    },
    chartsMetrics: {
      salesByMonth: null,
      topProducts: null,
      salesByCategory: null,
      orderStatus: null,
    },
    selectedPeriod: 'month',
    loading: false,
    error: null
  });

  indicators = computed(() => this.state().indicators);
  chartsMetrics = computed(() => this.state().chartsMetrics);
  selectedPeriod = computed(() => this.state().selectedPeriod);

  async getDashboardMetrics(skipLoader = true): Promise<void> {
    this.setLoading(true);
    this.clearError();

    try {
      await lastValueFrom(
        this.homeService
          .getDashboardMetrics(this.state().selectedPeriod, skipLoader)
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
            catchError(error => this.handleError(error)),
            finalize(() => this.setLoading(false))
          )
      );
    } catch {
      this.setError('Erro ao carregar métricas do dashboard.');
      this.setLoading(false);
    }
  }

  async loadAllMetrics(skipLoader = true): Promise<void> {
    this.setLoading(true);
    this.clearError();

    try {
      await Promise.all([
        this.getDashboardMetrics(skipLoader),
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

  setChartsMetrics(metrics: ChartsMetrics) {
    this.updateState('chartsMetrics', metrics);
  }

  setSelectedPeriod(period: HomeModuleState['selectedPeriod']) {
    this.updateState('selectedPeriod', period);
    // Recarregar dados quando o período mudar
    this.loadAllMetrics(true);
  }

  constructor() {
    super();
  }
}
