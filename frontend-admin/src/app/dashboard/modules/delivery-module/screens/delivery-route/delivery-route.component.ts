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
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { Delivery, DeliveryRoute } from '../../interfaces/delivery.interface';
import { NgIcon } from '@ng-icons/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'fuse-delivery-route',
  templateUrl: './delivery-route.component.html',
  styleUrls: ['./delivery-route.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    CommonModule,
    ButtonModule,
    NgIcon,
    CardModule,
  ],
  providers: [DeliveryState],
})
export class DeliveryRouteComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private coreService = inject(CoreService);
  private deliveryState = inject(DeliveryState);
  private toast = inject(MessageService);

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

  private async loadDelivery() {
    const id = this.deliveryId();
    if (!id) return;

    try {
      const delivery = await this.deliveryState.getDeliveryById(id);
      this.delivery.set(delivery);
      this.route.set(delivery.route || null);
      this.coreService.setPageTitle(
        `Rota de Entrega #${delivery.id}`,
        delivery.name || 'Visualizar Rota'
      );
    } catch (error) {
      console.error('Erro ao carregar entrega:', error);
      this.toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao carregar dados da rota',
      });
    }
  }

  generateRoute() {
    const id = this.deliveryId();
    if (!id) return;

    this.deliveryState.generateRoute(id).then(() => {
      this.toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Rota gerada com sucesso',
      });
      this.loadDelivery();
    });
  }

  optimizeRoute() {
    const id = this.deliveryId();
    if (!id) return;

    this.deliveryState.optimizeRoute(id).then(() => {
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
}

