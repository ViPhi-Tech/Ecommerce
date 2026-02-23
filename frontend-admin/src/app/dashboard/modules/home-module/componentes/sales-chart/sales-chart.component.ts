import { Component, computed, input } from '@angular/core';

import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { SalesByMonth } from 'app/shared/interfaces/home/HomeModuleState';
import { EmptyStateComponent } from 'app/shared/components/empty-state/empty-state.component';

@Component({
  selector: 'fuse-sales-chart',
  standalone: true,
  imports: [NgxEchartsModule, EmptyStateComponent],
  templateUrl: './sales-chart.component.html',
  styleUrls: ['./sales-chart.component.scss'],
})
export class SalesChartComponent {
  data = input<SalesByMonth[]>([]);
  title = input<string>('Vendas por Mês');
  loading = input<boolean>(false);

  totals = computed<number[]>(() => {
    return this.data().map(item => item.total);
  });

  labels = computed<string[]>(() => {
    return this.data().map(item => item.month);
  });

  // Computed para verificar se há dados
  hasData = computed<boolean>(() => {
    return this.data().length > 0 && this.data().some(item => item.total > 0);
  });

  chartOption = computed<EChartsOption>(() => ({
    title: {
      text: this.title(),
      left: 'center',
      top: '0px',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
      },
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const value = params[0]?.value || 0;
        const formattedValue = new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(value);
        return `${params[0]?.name}: ${formattedValue}`;
      },
    },
    xAxis: {
      type: 'category',
      data: this.hasData()
        ? this.labels()
        : [
            'Jan',
            'Fev',
            'Mar',
            'Abr',
            'Mai',
            'Jun',
            'Jul',
            'Ago',
            'Set',
            'Out',
            'Nov',
            'Dez',
          ],
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value: number) => {
          return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(value);
        },
      },
    },
    series: [
      {
        data: this.hasData() ? this.totals() : [],
        type: 'line',
        smooth: true,
        itemStyle: {
          color: '#3b82f6',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(59, 130, 246, 0.3)',
              },
              {
                offset: 1,
                color: 'rgba(59, 130, 246, 0.1)',
              },
            ],
          },
        },
      },
    ],
  }));
}
