import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { NgIcon } from '@ng-icons/core';
import { HomeState } from './home.state';
import { formatCurrency } from 'app/shared/utils/utils';
import { IndicatorsComponent } from './componentes/indicators/indicators.component';
import { SalesChartComponent } from './componentes/sales-chart/sales-chart.component';
import { TopProductsChartComponent } from './componentes/top-products-chart/top-products-chart.component';
import { CategoriesChartComponent } from './componentes/categories-chart/categories-chart.component';
import { OrderStatusChartComponent } from './componentes/order-status-chart/order-status-chart.component';
import PeriodComponent from 'app/shared/components/period/period.component';
import { PeriodRange } from 'app/shared/components/period-month/period-month.component';
import dayjs from 'dayjs';

@Component({
  selector: 'fuse-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    NgIcon,
    PeriodComponent,
    IndicatorsComponent,
    SalesChartComponent,
    TopProductsChartComponent,
    CategoriesChartComponent,
    OrderStatusChartComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private homeState = inject(HomeState);

  // Computed signals do state
  loading = this.homeState.loading;
  error = this.homeState.error;
  charts = this.homeState.charts;

  indicators = computed(() => {
    const metrics = this.homeState.indicators();

    return [
      {
        title: 'Vendas Totais',
        value: formatCurrency(metrics.totalSales || 0),
        trend:
          (metrics.totalSales || 0) >= 0 ? ('up' as const) : ('down' as const),
        icon: 'lucideTrendingUp',
      },
      {
        title: 'Pedidos',
        value: (metrics.totalOrders || 0).toString(),
        trend:
          (metrics.totalOrders || 0) >= 0 ? ('up' as const) : ('down' as const),
        icon: 'lucideShoppingCart',
      },
      {
        title: 'Clientes Ativos',
        value: (metrics.activeClients || 0).toString(),
        trend:
          (metrics.activeClients || 0) >= 0
            ? ('up' as const)
            : ('down' as const),
        icon: 'lucideUsers',
      },
      {
        title: 'Produtos em Estoque',
        value: (metrics.totalProductsWithStock || 0).toString(),
        trend:
          (metrics.totalProductsWithStock || 0) >= 0
            ? ('up' as const)
            : ('down' as const),
        icon: 'lucidePackage',
      },
    ];
  });

  chart = computed(() => {
    return this.homeState.charts();
  });

  constructor() {}

  ngOnInit(): void {
    // Primeiro carregamento sera apos o perido carregar
  }

  private async loadDashboardData(): Promise<void> {
    await this.homeState.loadAllMetrics();
  }

  public async refreshData(): Promise<void> {
    await this.loadDashboardData();
  }

  public onPeriodChange(period: PeriodRange): void {
    this.homeState.setDateFilter({
      startDate: dayjs(period.startDate).format('YYYY-MM-DD'),
      endDate: dayjs(period.endDate).format('YYYY-MM-DD'),
    });
  }

  private calculatePercentage(): string {
    const randomPercentage = Math.floor(Math.random() * 20) - 10;
    return `${randomPercentage > 0 ? '+' : ''}${randomPercentage}%`;
  }
}
