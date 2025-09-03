import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { TopProduct } from 'app/shared/interfaces/home/HomeModuleState';

@Component({
  selector: 'fuse-top-products-chart',
  standalone: true,
  imports: [CommonModule, NgxEchartsModule],
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
      value: item.total
    }));
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
        data:
          this.data.length > 0
            ? this.chartData()
            : [],
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
