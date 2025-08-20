import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'fuse-sales-chart',
  standalone: true,
  imports: [CommonModule, NgxEchartsModule],
  templateUrl: './sales-chart.component.html',
  styleUrls: ['./sales-chart.component.scss'],
})
export class SalesChartComponent {
  @Input() data: number[] = [];
  @Input() labels: string[] = [];
  @Input() title = 'Vendas por Mês';

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
      formatter: '{b}: R$ {c}',
    },
    xAxis: {
      type: 'category',
      data:
        this.labels.length > 0
          ? this.labels
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
        formatter: 'R$ {value}',
      },
    },
    series: [
      {
        data:
          this.data.length > 0
            ? this.data
            : [
                15000, 18000, 22000, 25000, 28000, 32000, 35000, 38000, 42000,
                45000, 48000, 52000,
              ],
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
