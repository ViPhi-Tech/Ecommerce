import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';

export interface ProductData {
  value: number;
  name: string;
}

@Component({
  selector: 'fuse-top-products-chart',
  standalone: true,
  imports: [CommonModule, NgxEchartsModule],
  templateUrl: './top-products-chart.component.html',
  styleUrls: ['./top-products-chart.component.scss'],
})
export class TopProductsChartComponent {
  @Input() data: ProductData[] = [];
  @Input() title = 'Produtos Mais Vendidos';

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
            ? this.data
            : [
                { value: 335, name: 'Smartphone Galaxy' },
                { value: 310, name: 'Notebook Dell' },
                { value: 234, name: 'Fone Bluetooth' },
                { value: 135, name: 'Tablet iPad' },
                { value: 156, name: 'Smartwatch' },
              ],
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
