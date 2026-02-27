import { Component, computed, input } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { OrderStatu } from 'app/shared/interfaces/home/HomeModuleState';
import { EmptyStateComponent } from 'app/shared/components/empty-state/empty-state.component';

export interface OrderStatusData {
  value: number;
  name: string;
  itemStyle?: { color: string };
}

@Component({
  selector: 'fuse-order-status-chart',
  imports: [NgxEchartsModule, EmptyStateComponent],
  templateUrl: './order-status-chart.component.html',
  styleUrl: './order-status-chart.component.scss',
})
export class OrderStatusChartComponent {
  data = input<OrderStatu[]>([]);
  title = input<string>('Status dos Pedidos');
  loading = input<boolean>(false);

  // Mapeamento de cores para cada status
  private statusColors: Record<string, string> = {
    Pendente: '#f59e0b',
    Processando: '#3b82f6',
    Enviado: '#10b981',
    Entregue: '#059669',
    Cancelado: '#ef4444',
    'Aguardando Pagamento': '#f59e0b',
    'Pagamento Aprovado': '#3b82f6',
    'Em Preparação': '#8b5cf6',
    'Pronto para Envio': '#06b6d4',
    'Em Trânsito': '#10b981',
  };

  // Converte os dados para o formato esperado pelo gráfico
  chartData = computed<OrderStatusData[]>(() => {
    return this.data().map(item => ({
      name: item.name,
      value: item.total,
      itemStyle: {
        color: this.statusColors[item.name] || '#6b7280',
      },
    }));
  });

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
        data: this.hasData() ? this.chartData() : [],
      },
    ],
  }));
}
