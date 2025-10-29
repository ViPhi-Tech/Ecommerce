import { Component, OnInit, Renderer2, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderState } from '../../dashboard/modules/order-module/order.state';
import { Order } from '../../dashboard/modules/order-module/interfaces/order.interface';
import {
  DatePipe,
  CurrencyPipe,
  TitleCasePipe,
  CommonModule,
} from '@angular/common';

@Component({
  selector: 'fuse-order-report',
  templateUrl: './order-report.component.html',
  styleUrls: ['./order-report.component.scss'],
  providers: [OrderState],
  imports: [CommonModule, DatePipe, CurrencyPipe, TitleCasePipe],
  standalone: true,
})
export class OrderReportComponent implements OnInit {
  private route = inject(ActivatedRoute);
  public orderState = inject(OrderState);

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    // Buscar pedido baseado nos parâmetros da URL
    this.getOrderFromParams();

    // Define estilo de impressão para A4 sem margens
    const style = this.renderer.createElement('style');
    style.innerHTML = `
      @media print {
        @page {
          size: A4;
          margin: 0;
        }
        body {
          margin: 0 !important;
          padding: 0 !important;
        }
      }
    `;
    this.renderer.appendChild(document.head, style);
  }

  private getOrderFromParams(): void {
    this.route.params.subscribe(params => {
      const orderId = params['id'];

      if (orderId) {
        // Usar o OrderState para buscar o pedido
        this.orderState.getOrderById(orderId).then((order: Order) => {
          console.log('📊 OrderState loading:', order);
          // Aguarda um tick para garantir renderização, então chama print
          setTimeout(() => {
            window.print();
          }, 0);
        });
      } else {
        console.warn('⚠️ Nenhum ID de pedido encontrado nos parâmetros');
      }
    });

    // Log dos query params também
    this.route.queryParams.subscribe(queryParams => {
      console.log('🔗 Query params:', queryParams);
    });
  }

  getTotalItemsQuantity(): number {
    const order = this.orderState.orderDetails();
    if (!order?.items) return 0;
    return order.items.reduce((total, item) => total + item.quantity, 0);
  }
}
