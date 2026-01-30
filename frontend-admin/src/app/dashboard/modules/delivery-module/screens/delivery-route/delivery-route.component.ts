import {
  Component,
  OnInit,
  inject,
  DestroyRef,
  signal,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { DeliveryState } from '../../delivery.state';
import { CoreService } from 'app/shared/services/core.service';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { Delivery, DeliveryRoute } from '../../interfaces/delivery.interface';
import { CardModule } from 'primeng/card';
import { HttpClient } from '@angular/common/http';
import { environments } from 'src/environments/environments';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'fuse-delivery-route',
  templateUrl: './delivery-route.component.html',
  styleUrls: ['./delivery-route.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, CommonModule, ButtonModule, TagModule, CardModule, DatePipe, CurrencyPipe],
  providers: [DeliveryState],
})
export class DeliveryRouteComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private coreService = inject(CoreService);
  private deliveryState = inject(DeliveryState);
  private toast = inject(MessageService);
  private cdr = inject(ChangeDetectorRef);
  private http = inject(HttpClient);
  private apiUrl = environments.apiUrl;

  delivery = signal<Delivery | null>(null);
  deliveryId = signal<string | null>(null);
  route = signal<DeliveryRoute | null>(null);

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.deliveryId.set(id);
      this.loadDelivery();
    }
  }

  private isUuid(value: string): boolean {
    // Verifica se é um UUID válido (formato: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }

  private async findUuidById(id: string | number): Promise<string | null> {
    try {
      // Busca na lista de entregas para encontrar o UUID correspondente ao ID
      const deliveries = this.deliveryState.deliveryList();
      const delivery = deliveries.find(d => d.id === id || d.id?.toString() === id?.toString());
      if (delivery?.uuid) {
        return delivery.uuid;
      }
      
      // Se não encontrar na lista em cache, tenta buscar todas as entregas
      this.deliveryState.getDeliveryList(false);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Aguarda carregar
      const updatedDeliveries = this.deliveryState.deliveryList();
      const foundDelivery = updatedDeliveries.find(d => d.id === id || d.id?.toString() === id?.toString());
      return foundDelivery?.uuid || null;
    } catch (err) {
      console.error('Erro ao buscar UUID:', err);
      return null;
    }
  }

  private async loadDelivery() {
    const id = this.deliveryId();
    if (!id) return;

    try {
      let uuid = id;
      
      // Se não for UUID, tenta encontrar o UUID correspondente ao ID
      if (!this.isUuid(id)) {
        const foundUuid = await this.findUuidById(id);
        if (!foundUuid) {
          this.toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Não foi possível encontrar o UUID da entrega. Tente novamente.',
          });
          return;
        }
        uuid = foundUuid;
        this.deliveryId.set(uuid);
      }

      // Sempre chama o backend com UUID
      const delivery = await this.deliveryState.getDeliveryById(uuid);
      console.log('Delivery carregado:', delivery);
      console.log('Orders:', delivery.orders);
      console.log('Delivery tem orders?', !!delivery.orders);
      console.log('Quantidade de orders:', delivery.orders?.length);
      
      this.delivery.set(delivery);
      this.route.set(delivery.route || null);
      
      // Garante que o deliveryId está com o UUID
      if (delivery.uuid) {
        this.deliveryId.set(delivery.uuid);
      }
      
      // Força detecção de mudanças
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Erro ao carregar entrega:', error);
      this.toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao carregar dados da rota. Verifique se o UUID está correto.',
      });
    }
  }

  generateRoute() {
    const delivery = this.delivery();
    if (!delivery) return;

    // Usa UUID se disponível, caso contrário usa o ID
    const identifier = delivery.uuid || delivery.id;
    if (!identifier) return;

    this.deliveryState.generateRoute(identifier).then(() => {
      this.toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Rota gerada com sucesso',
      });
      this.loadDelivery();
    });
  }

  optimizeRoute() {
    const delivery = this.delivery();
    if (!delivery) return;

    // Usa UUID se disponível, caso contrário usa o ID
    const identifier = delivery.uuid || delivery.id;
    if (!identifier) return;

    this.deliveryState.optimizeRoute(identifier).then(() => {
      this.toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Rota otimizada com sucesso',
      });
      this.loadDelivery();
    });
  }

  backToDelivery() {
    const id = this.deliveryId();
    if (id) {
      this.router.navigate(['dashboard', 'deliveries', id, 'view']);
    }
  }

  getTotalValue(): number {
    const deliveryData = this.delivery();
    if (!deliveryData?.orders || deliveryData.orders.length === 0) {
      return 0;
    }
    return deliveryData.orders.reduce((sum, order) => sum + (order.total || 0), 0);
  }

  async markOrderAsDelivered(orderId: number) {
    try {
      const response = await lastValueFrom(
        this.http.patch<ApiResponse<any>>(
          `${this.apiUrl}order/${orderId}/delivered`,
          {}
        )
      );

      this.toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Pedido marcado como entregue',
      });

      // Recarrega os dados da entrega para atualizar o status do pedido
      const deliveryId = this.deliveryId();
      if (deliveryId) {
        await this.loadDelivery();
        
        // Verifica se todos os pedidos foram entregues
        await this.checkAndCompleteDelivery();
      }
    } catch (error: any) {
      console.error('Erro ao marcar pedido como entregue:', error);
      this.toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: error?.error?.description || 'Erro ao marcar pedido como entregue',
      });
    }
  }

  private async checkAndCompleteDelivery() {
    const deliveryData = this.delivery();
    if (!deliveryData || !deliveryData.orders || deliveryData.orders.length === 0) {
      return;
    }

    // Verifica se todos os pedidos estão entregues
    const allOrdersDelivered = deliveryData.orders.every(order => 
      this.isOrderDelivered(order.status)
    );

    // Verifica se a entrega ainda não está finalizada
    const deliveryStatus = deliveryData.status?.toUpperCase();
    const isDeliveryNotCompleted = deliveryStatus !== 'DELIVERED';

    if (allOrdersDelivered && isDeliveryNotCompleted) {
      const uuid = deliveryData.uuid || this.deliveryId();
      if (uuid) {
        try {
          await this.deliveryState.completeDelivery(uuid);
          this.toast.add({
            severity: 'success',
            summary: 'Entrega Finalizada',
            detail: 'Todos os pedidos foram entregues. A entrega foi finalizada automaticamente.',
          });
          
          // Recarrega os dados para atualizar o status
          await this.loadDelivery();
        } catch (error: any) {
          console.error('Erro ao finalizar entrega:', error);
          this.toast.add({
            severity: 'warn',
            summary: 'Aviso',
            detail: 'Todos os pedidos foram entregues, mas houve um erro ao finalizar a entrega automaticamente.',
          });
        }
      }
    }
  }

  isOrderDelivered(orderStatus: string | null | undefined): boolean {
    return orderStatus === 'DELIVERED';
  }
}
