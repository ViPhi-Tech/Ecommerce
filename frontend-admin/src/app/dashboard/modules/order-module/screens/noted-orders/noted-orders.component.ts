import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { NgIcon } from '@ng-icons/core';
import PeriodComponent, {
  PeriodRange,
} from 'app/shared/components/period/period.component';
import { OrderState } from '../../order.state';
import { ClientState } from '../../../client-module/client.state';
import { CoreService } from 'app/shared/services/core.service';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'fuse-noted-orders',
  templateUrl: './noted-orders.component.html',
  styleUrls: ['./noted-orders.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    SelectModule,
    NgIcon,
    PeriodComponent,
    ButtonModule,
    TagModule,
    Tooltip,
    CurrencyPipe,
  ],
  providers: [OrderState],
})
export class NotedOrdersComponent implements OnInit {
  private coreService = inject(CoreService);
  state = inject(OrderState);
  clientState = inject(ClientState);

  selectedClient = signal<string | null>(null);
  selectedPeriod = signal<PeriodRange | null>(null);

  clientOptions = computed(() => {
    const clients = this.clientState.clientList();
    return [
      { label: 'Todos os clientes', value: null },
      ...clients.map(client => ({
        label: client.fullName || client.document || 'Cliente sem nome',
        value: client.fullName || client.document || '',
      })),
    ];
  });

  filteredOrderList = computed(() => {
    const orders = this.state.orderList();
    const selectedClient = this.selectedClient();
    const period = this.selectedPeriod();

    let filtered = orders;

    // Filtrar por cliente
    if (selectedClient) {
      filtered = filtered.filter(
        order => order.client?.fullName === selectedClient
      );
    }

    // Filtrar por período (se necessário implementar)
    if (period) {
      // TODO: Implementar filtro por período se os pedidos tiverem data
      console.log('Filtrar por período:', period);
    }

    return filtered;
  });

  ngOnInit() {
    this.coreService.setPageTitle(
      'Pedidos Anotados',
      'Visualize os pedidos pendentes de forma organizada'
    );
    this.state.getOrderList();
    this.clientState.getClientList();
  }

  onClientChange(clientName: string | null) {
    this.selectedClient.set(clientName);
  }

  onPeriodChange(range: PeriodRange) {
    this.selectedPeriod.set(range);
  }

  getStatusSeverity(status: string): any {
    const severityMap: any = {
      PENDING: 'warn',
      PAID: 'success',
      CANCELLED: 'danger',
      PROCESSING: 'info',
    };
    return severityMap[status] || 'secondary';
  }

  getStatusLabel(status: string): string {
    const labelMap: any = {
      PENDING: 'Pendente',
      PAID: 'Pago',
      CANCELLED: 'Cancelado',
      PROCESSING: 'Processando',
    };
    return labelMap[status] || status;
  }
}

