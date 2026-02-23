import { Component, Input, computed } from '@angular/core';

import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { TopProduct } from 'app/shared/interfaces/home/HomeModuleState';
import { EmptyStateComponent } from 'app/shared/components/empty-state/empty-state.component';

@Component({
  selector: 'fuse-top-products-chart',
  standalone: true,
  imports: [NgxEchartsModule, EmptyStateComponent],
  templateUrl: './top-products-chart.component.html',
  styleUrls: ['./top-products-chart.component.scss'],
})
export class TopProductsChartComponent {
  @Input() data: TopProduct[] = [];
  @Input() title = 'Produtos Mais Vendidos';
  @Input() loading = false;

  // Converte os dados para o formato esperado pelo gráfico
  chartData = computed(() => {
    return this.data.map(item => ({
      name: item.name,
      value: item.total,
    }));
  });

  // Computed para verificar se há dados
  hasData = computed<boolean>(() => {
    return this.data.length > 0 && this.data.some(item => item.total > 0);
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
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      bottom: '0px',
      left: 'center',
    },
    series: [
      {
        name: 'Produtos',
        type: 'pie',
        radius: ['20%', '45%'],
        center: ['50%', '45%'],
        data: this.hasData() ? this.chartData() : [],
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }));
}
