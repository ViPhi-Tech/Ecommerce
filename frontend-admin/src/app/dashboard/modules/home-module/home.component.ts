import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreService } from 'app/shared/services/core.service';
import { HomeState } from './home.state';
import { Subscription } from 'rxjs';
import { formatCurrency } from 'app/shared/utils/utils';
import { IndicatorsComponent } from './componentes/indicators/indicators.component';
import { SalesChartComponent } from './componentes/sales-chart/sales-chart.component';
import { TopProductsChartComponent } from './componentes/top-products-chart/top-products-chart.component';
import { CategoriesChartComponent } from './componentes/categories-chart/categories-chart.component';
import { OrderStatusChartComponent } from './componentes/order-status-chart/order-status-chart.component';

@Component({
  selector: 'fuse-home',
  standalone: true,
  imports: [
    CommonModule,
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
  private coreService = inject(CoreService);
  private homeState = inject(HomeState);

  private refreshSubscription: Subscription | null = null;

  // Computed signals do state
  loading = this.homeState.loading;
  error = this.homeState.error;
  chartsMetrics = this.homeState.chartsMetrics;
  selectedPeriod = this.homeState.selectedPeriod;

  indicators = computed(() => {
    const metrics = this.homeState.indicators();

    return [
      {
        title: 'Vendas Totais',
        value: formatCurrency(metrics.totalSales || 0),
        percentage: this.calculatePercentage(),
        trend:
          (metrics.totalSales || 0) >= 0 ? ('up' as const) : ('down' as const),
        icon: 'lucideTrendingUp',
      },
      {
        title: 'Pedidos Hoje',
        value: (metrics.totalOrders || 0).toString(),
        percentage: this.calculatePercentage(),
        trend:
          (metrics.totalOrders || 0) >= 0 ? ('up' as const) : ('down' as const),
        icon: 'lucideShoppingCart',
      },
      {
        title: 'Clientes Ativos',
        value: (metrics.activeClients || 0).toString(),
        percentage: this.calculatePercentage(),
        trend:
          (metrics.activeClients || 0) >= 0
            ? ('up' as const)
            : ('down' as const),
        icon: 'lucideUsers',
      },
      {
        title: 'Produtos em Estoque',
        value: (metrics.totalProductsWithStock || 0).toString(),
        percentage: this.calculatePercentage(),
        trend:
          (metrics.totalProductsWithStock || 0) >= 0
            ? ('up' as const)
            : ('down' as const),
        icon: 'lucidePackage',
      },
    ];
  });

  constructor() {}

  ngOnInit(): void {
    this.coreService.setPageTitle('Home', 'Dashboard');
    this.loadDashboardData();
  }

  private async loadDashboardData(): Promise<void> {
    await this.homeState.loadAllMetrics();
  }

  public refreshData(): void {
    this.loadDashboardData();
  }

  public changePeriod(period: 'today' | 'week' | 'month' | 'year'): void {
    this.homeState.setSelectedPeriod(period);
  }

  private calculatePercentage(): string {
    const randomPercentage = Math.floor(Math.random() * 20) - 10;
    return `${randomPercentage > 0 ? '+' : ''}${randomPercentage}%`;
  }
}
