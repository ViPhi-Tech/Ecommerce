import {
  Component,
  computed,
  DestroyRef,
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
import { CheckboxModule } from 'primeng/checkbox';
import dayjs from 'dayjs';
import { AccountsReceivableState } from 'app/dashboard/modules/accounts-receivable-module/accounts-receivable.state';
import { ActivatedRoute, Router } from '@angular/router';
import { IAccountsReceivable } from 'app/shared/interfaces/accounts-receivable/AccountsReceivable';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
    CheckboxModule,
  ],
  providers: [OrderState],
})
export class NotedOrdersComponent implements OnInit {
  private coreService = inject(CoreService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private accountsReceivableState = inject(AccountsReceivableState);
  state = inject(OrderState);
  destroyedRef = inject(DestroyRef);

  selectedClient = signal<string | null>(null);
  selectedPeriod = signal<PeriodRange | null>(null);
  selectedOrders = signal<Set<string | number>>(new Set());

  filteredNotedOrderList = computed(() => {
    const orders = this.state.notedOrderList();
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

    // Pega o clientId dos query params e seta no select
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe(params => {
        const clientId = params['clientId'];
        if (clientId) {
          this.selectedClient.set(clientId);
        }
      });

    this.handleAccountsReceivableSubmit();
  }

  handleAccountsReceivableSubmit() {
    this.accountsReceivableState.onSubmit$
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe(success => {
        if (success) {
          this.getOrderList();
        }
      });
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
      'account_receivable',
      true
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

  isOrderSelected(orderId: string | number): boolean {
    return this.selectedOrders().has(orderId);
  }

  toggleOrderSelection(orderId: string | number) {
    const selected = new Set(this.selectedOrders());
    if (selected.has(orderId)) {
      selected.delete(orderId);
    } else {
      selected.add(orderId);
    }
    this.selectedOrders.set(selected);
  }

  getSelectedOrdersCount(): number {
    return this.selectedOrders().size;
  }

  hasSelections(): boolean {
    return this.selectedOrders().size > 0;
  }

  getTotalValueOfSelectedOrders(): number {
    const selectedIds = this.selectedOrders();
    return this.filteredNotedOrderList()
      .filter(order => selectedIds.has(order.id))
      .reduce((sum, order) => sum + order.total, 0);
  }

  clearSelection() {
    this.selectedOrders.set(new Set());
  }

  generateAccountsReceivable() {
    const selectedIds = Array.from(this.selectedOrders());
    if (selectedIds.length === 0) {
      return;
    }

    const selectedOrdersData = this.filteredNotedOrderList().filter(order =>
      selectedIds.includes(order.id)
    );

    if (selectedOrdersData.length === 0) {
      return;
    }

    const total = selectedOrdersData.reduce(
      (sum, order) => sum + order.total,
      0
    );
    console.log(selectedOrdersData);

    const data: Partial<IAccountsReceivable & { action: string }> = {
      clientId: Number(this.selectedClient()),
      amount: total,
      orders: selectedOrdersData.map(order => order.id.toString()),
      action: 'noted-orders',
      description:
        'Pedidos anotados: ' +
        selectedOrdersData.map(order => order.id.toString()).join(', '),
    };

    this.router
      .navigate([{ outlets: { drawer: ['accounts-receivable', 'new'] } }])
      .then(() => {
        this.accountsReceivableState.prefillForm(data);
      });
  }
}
