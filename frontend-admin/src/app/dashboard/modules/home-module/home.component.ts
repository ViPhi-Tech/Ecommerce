import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { CoreService } from 'app/shared/services/core.service';

// Interfaces para tipagem
interface Indicator {
  title: string;
  value: string;
  percentage: string;
  trend: 'up' | 'down';
  icon: string;
}

@Component({
  selector: 'fuse-home',
  standalone: true,
  imports: [CommonModule, NgxEchartsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private coreService = inject(CoreService);

  // Dados dos indicadores usando signal
  indicators = signal<Indicator[]>([
    {
      title: 'Vendas Totais',
      value: 'R$ 124.590,00',
      percentage: '+12.5%',
      trend: 'up' as const,
      icon: 'lucideTrendingUp',
    },
    {
      title: 'Pedidos Hoje',
      value: '47',
      percentage: '+8.2%',
      trend: 'up' as const,
      icon: 'lucideShoppingCart',
    },
    {
      title: 'Clientes Ativos',
      value: '1.245',
      percentage: '+5.7%',
      trend: 'up' as const,
      icon: 'lucideUsers',
    },
    {
      title: 'Produtos em Estoque',
      value: '892',
      percentage: '-2.1%',
      trend: 'down' as const,
      icon: 'lucidePackage',
    },
  ]);

  // Configuração do gráfico de vendas usando signal
  salesChartOption = signal<EChartsOption>({
    title: {
      text: 'Vendas por Mês',
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
      data: [
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
        data: [
          15000, 18000, 22000, 25000, 28000, 32000, 35000, 38000, 42000, 45000,
          48000, 52000,
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
  });

  // Configuração do gráfico de produtos mais vendidos usando signal
  topProductsChartOption = signal<EChartsOption>({
    title: {
      text: 'Produtos Mais Vendidos',
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
        data: [
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
  });

  // Configuração do gráfico de categorias usando signal
  categoriesChartOption = signal<EChartsOption>({
    title: {
      text: 'Vendas por Categoria',
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
      data: [
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
        data: [25000, 18000, 15000, 12000, 8000, 10000],
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
  });

  // Configuração do gráfico de status de pedidos usando signal
  orderStatusChartOption = signal<EChartsOption>({
    title: {
      text: 'Status dos Pedidos',
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
        data: [
          { value: 156, name: 'Pendente', itemStyle: { color: '#f59e0b' } },
          { value: 89, name: 'Processando', itemStyle: { color: '#3b82f6' } },
          { value: 234, name: 'Enviado', itemStyle: { color: '#10b981' } },
          { value: 67, name: 'Entregue', itemStyle: { color: '#059669' } },
          { value: 23, name: 'Cancelado', itemStyle: { color: '#ef4444' } },
        ],
      },
    ],
  });

  constructor() {}

  ngOnInit(): void {
    this.coreService.setPageTitle('Home', 'Dashboard');
  }
}
