import {
  Component,
  OnInit,
  inject,
  DestroyRef,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { DeliveryState } from '../../delivery.state';
import { CoreService } from 'app/shared/services/core.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { Delivery, DeliveryStatus } from '../../interfaces/delivery.interface';
import { NgIcon } from '@ng-icons/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'fuse-delivery-view',
  templateUrl: './delivery-view.component.html',
  styleUrls: ['./delivery-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    CommonModule,
    ButtonModule,
    TagModule,
    NgIcon,
    CardModule,
    // CurrencyPipe,
    DatePipe,
  ],
  providers: [DeliveryState],
})
export class DeliveryViewComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private coreService = inject(CoreService);
  private deliveryState = inject(DeliveryState);
  private toast = inject(MessageService);

  delivery = signal<Delivery | null>(null);
  deliveryId = signal<string | null>(null);

  statusSeverityMap: Record<DeliveryStatus, any> = {
    [DeliveryStatus.PENDING]: 'warning',
    [DeliveryStatus.SCHEDULED]: 'info',
    [DeliveryStatus.IN_ROUTE]: 'primary',
    [DeliveryStatus.DELIVERED]: 'success',
    [DeliveryStatus.CANCELLED]: 'danger',
  };

  statusLabelMap: Record<DeliveryStatus, string> = {
    [DeliveryStatus.PENDING]: 'Pendente',
    [DeliveryStatus.SCHEDULED]: 'Agendada',
    [DeliveryStatus.IN_ROUTE]: 'Em Rota',
    [DeliveryStatus.DELIVERED]: 'Entregue',
    [DeliveryStatus.CANCELLED]: 'Cancelada',
  };

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.deliveryId.set(id);
      this.loadDelivery();
    }
  }

  private async loadDelivery() {
    const id = this.deliveryId();
    if (!id) return;

    try {
      const delivery = await this.deliveryState.getDeliveryById(id);
      this.delivery.set(delivery);
    } catch (error) {
      console.error('Erro ao carregar entrega:', error);
      this.toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao carregar dados da entrega',
      });
    }
  }

  viewRoute() {
    const deliveryData = this.delivery();
    if (!deliveryData) return;

    // Usa UUID se disponível, caso contrário usa o ID
    const identifier = deliveryData.uuid || deliveryData.id;
    if (!identifier) return;

    this.router.navigate(['dashboard', 'deliveries', identifier, 'route']);
  }

  editDelivery() {
    const id = this.deliveryId();
    if (id) {
      this.router.navigate(['dashboard', 'deliveries', id, 'edit']);
    }
  }

  generateRoute() {
    const deliveryData = this.delivery();
    if (!deliveryData) return;

    // Usa UUID se disponível, caso contrário usa o ID
    const identifier = deliveryData.uuid || deliveryData.id;
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
    const deliveryData = this.delivery();
    if (!deliveryData) return;

    // Usa UUID se disponível, caso contrário usa o ID
    const identifier = deliveryData.uuid || deliveryData.id;
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
}
