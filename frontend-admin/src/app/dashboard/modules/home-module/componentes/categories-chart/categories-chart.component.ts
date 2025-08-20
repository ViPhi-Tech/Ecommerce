import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'fuse-categories-chart',
  standalone: true,
  imports: [CommonModule, NgxEchartsModule],
  templateUrl: './categories-chart.component.html',
  styleUrls: ['./categories-chart.component.scss'],
})
export class CategoriesChartComponent {
  @Input() data: number[] = [];
  @Input() categories: string[] = [];
  @Input() title = 'Vendas por Categoria';

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
      data:
        this.categories.length > 0
          ? this.categories
          : [
              'Eletrônicos',
              'Roupas',
              'Casa e Jardim',
              'Esportes',
              'Livros',
              'Beleza',
            ],
      axisLabel: {
        rotate: 45,
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: 'R$ {value}',
      },
    },
    series: [
      {
        name: 'Vendas',
        type: 'bar',
        data:
          this.data.length > 0
            ? this.data
            : [25000, 18000, 15000, 12000, 8000, 10000],
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
