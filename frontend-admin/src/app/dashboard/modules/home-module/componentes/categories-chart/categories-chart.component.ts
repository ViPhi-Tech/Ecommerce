import { Component, Input, computed } from '@angular/core';

import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { SalesByCategory } from 'app/shared/interfaces/home/HomeModuleState';
import { EmptyStateComponent } from 'app/shared/components/empty-state/empty-state.component';

@Component({
  selector: 'fuse-categories-chart',
  standalone: true,
  imports: [NgxEchartsModule, EmptyStateComponent],
  templateUrl: './categories-chart.component.html',
  styleUrls: ['./categories-chart.component.scss'],
})
export class CategoriesChartComponent {
  @Input() data: SalesByCategory[] = [];
  @Input() title = 'Vendas por Categoria';
  @Input() loading = false;

  // Extrair valores e categorias dos dados
  chartValues = computed<number[]>(() => {
    return this.data.map(item => item.total_quantity);
  });

  chartCategories = computed<string[]>(() => {
    return this.data.map(item => item.category_name);
  });

  // Computed para verificar se há dados
  hasData = computed<boolean>(() => {
    return (
      this.data.length > 0 && this.data.some(item => item.total_quantity > 0)
    );
  });

  chartOption = computed<EChartsOption>(() => ({
    title: {
      text: this.title,
      left: 'center',
      top: '0px',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    xAxis: {
      type: 'category',
      data: this.hasData() ? this.chartCategories() : [],
      axisLabel: {
        rotate: 45,
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}',
      },
    },
    series: [
      {
        name: 'Vendas',
        type: 'bar',
        data: this.hasData() ? this.chartValues() : [],
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: '#10b981',
              },
              {
                offset: 1,
                color: '#065f46',
              },
            ],
          },
          borderRadius: [4, 4, 0, 0],
        },
      },
    ],
  }));
}
