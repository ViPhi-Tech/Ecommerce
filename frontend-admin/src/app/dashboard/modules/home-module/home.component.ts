import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { NgIcon } from '@ng-icons/core';
import { CoreService } from 'app/shared/services/core.service';
import { HomeState } from './home.state';
import { formatCurrency } from 'app/shared/utils/utils';
import { IndicatorsComponent } from './componentes/indicators/indicators.component';
import { SalesChartComponent } from './componentes/sales-chart/sales-chart.component';
import { TopProductsChartComponent } from './componentes/top-products-chart/top-products-chart.component';
import { CategoriesChartComponent } from './componentes/categories-chart/categories-chart.component';
import { OrderStatusChartComponent } from './componentes/order-status-chart/order-status-chart.component';
import { SelectComponent } from 'app/shared/components/form/select/select.component';
import { DatePickerComponent } from 'app/shared/components/form/datepicker/datepicker.component';

@Component({
  selector: 'fuse-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    NgIcon,
    SelectComponent,
    DatePickerComponent,
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

  // Form controls para filtros
  dateRangeControl = new FormControl();
  periodControl = new FormControl('today');

  // Opções para o select de período
  periodOptions = [
    { label: 'Hoje', value: 'today' },
    { label: 'Esta Semana', value: 'week' },
    { label: 'Este Mês', value: 'month' },
    { label: 'Este Ano', value: 'year' },
    { label: 'Período Personalizado', value: 'custom' },
  ];

  // Computed signals do state
  loading = this.homeState.loading;
  error = this.homeState.error;
  charts = this.homeState.charts;
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

  chart = computed(() => {
    return this.homeState.charts();
  });

  constructor() {}

  ngOnInit(): void {
    this.coreService.setPageTitle('Home', 'Dashboard');
    this.loadDashboardData();

    // Configurar valor inicial do controle de período
    this.periodControl.setValue('today');

    // Escutar mudanças no dateRangeControl
    this.dateRangeControl.valueChanges.subscribe(value => {
      if (value) {
        this.onDateRangeChange(value);
      }
    });
  }

  private async loadDashboardData(): Promise<void> {
    await this.homeState.loadAllMetrics();
  }

  public async refreshData(): Promise<void> {
    await this.loadDashboardData();
  }

  public onPeriodChange(period: string): void {
    this.homeState.setSelectedPeriod(
      period as 'today' | 'week' | 'month' | 'year'
    );

    // Se for período personalizado, mostrar o datepicker
    if (period !== 'custom') {
      this.loadDashboardData();
    }
  }

  public onDateRangeChange(dateRange: Date): void {
    // Aqui você pode implementar a lógica para filtrar por data personalizada
    console.log('Data personalizada selecionada:', dateRange);
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
