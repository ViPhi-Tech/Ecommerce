import {
  Component,
  computed,
  effect,
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
import { CoreService } from 'app/shared/services/core.service';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ClientSelectComponent } from 'app/shared/components/client-select/client-select.component';
import dayjs from 'dayjs';

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
    CurrencyPipe,
    ClientSelectComponent,
  ],
  providers: [OrderState],
})
export class NotedOrdersComponent implements OnInit {
  private coreService = inject(CoreService);
  state = inject(OrderState);

  selectedClient = signal<string | null>(null);
  selectedPeriod = signal<PeriodRange | null>(null);

  filteredOrderList = computed(() => {
    const orders = this.state.orderList();
    return orders;
  });

  constructor() {
    // Effect para reagir a mudanças nos filtros
    effect(() => {
      const client = this.selectedClient();
      const period = this.selectedPeriod();

      // Só busca se tiver período selecionado
      if (client && period) {
        this.getOrderList();
      }
    });
  }

  ngOnInit() {
    this.coreService.setPageTitle(
      'Pedidos Anotados',
      'Visualize os pedidos pendentes de forma organizada'
    );
  }

  getOrderList() {
    const filter = {
      client: this.selectedClient(),
      startDate: dayjs(this.selectedPeriod()?.startDate).format('YYYY-MM-DD'),
      endDate: dayjs(this.selectedPeriod()?.endDate).format('YYYY-MM-DD'),
    };
    this.state.getOrderListByClient(
      this.selectedClient() || '',
      filter.startDate,
      filter.endDate,
      'account_receivable'
    );
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
