import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';

export interface OrderStatusData {
  value: number;
  name: string;
  itemStyle?: { color: string };
}

@Component({
  selector: 'fuse-order-status-chart',
  standalone: true,
  imports: [CommonModule, NgxEchartsModule],
  templateUrl: './order-status-chart.component.html',
  styleUrls: ['./order-status-chart.component.scss'],
})
export class OrderStatusChartComponent {
  @Input() data: OrderStatusData[] = [];
  @Input() title = 'Status dos Pedidos';
  @Input() loading = false;

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
    },
    legend: {
      bottom: '10px',
      left: 'center',
    },
    series: [
      {
        name: 'Status',
        type: 'pie',
        radius: ['30%', '50%'],
        center: ['50%', '40%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data:
          this.data.length > 0
            ? this.data
            : [
                {
                  value: 156,
                  name: 'Pendente',
                  itemStyle: { color: '#f59e0b' },
                },
                {
                  value: 89,
                  name: 'Processando',
                  itemStyle: { color: '#3b82f6' },
                },
                {
                  value: 234,
                  name: 'Enviado',
                  itemStyle: { color: '#10b981' },
                },
                {
                  value: 67,
                  name: 'Entregue',
                  itemStyle: { color: '#059669' },
                },
                {
                  value: 23,
                  name: 'Cancelado',
                  itemStyle: { color: '#ef4444' },
                },
              ],
      },
    ],
  }));
}
