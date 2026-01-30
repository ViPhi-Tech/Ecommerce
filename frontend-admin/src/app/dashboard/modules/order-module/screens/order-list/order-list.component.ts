import {
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
  TemplateRef,
  ViewChild,
  computed,
} from '@angular/core';
import { Router } from '@angular/router';
import { CoreService } from 'app/shared/services/core.service';
import { TableComponent } from 'app/shared/components/table/table.component';
import {
  DEFAULT_TABLE_CONFIG,
  TableConfig,
} from 'app/shared/interfaces/table.interfaces';
import { OrderState } from '../../order.state';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { ButtonModule } from 'primeng/button';
import { heightAnimation } from 'app/shared/utils/animations';
import { TagModule } from 'primeng/tag';
import { PopoverModule } from 'primeng/popover';
import { ConfirmationService, MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OrderService } from '../../order.service';
import { FormsModule } from '@angular/forms';
import { Tooltip } from 'primeng/tooltip';
import { SelectModule } from 'primeng/select';
import PeriodMonthComponent, {
  PeriodRange,
} from 'app/shared/components/period-month/period-month.component';
import { AccountsReceivableState } from 'app/dashboard/modules/accounts-receivable-module/accounts-receivable.state';
import { PAYMENTS_SITEMAP } from 'app/shared/constants/payments.sitemap';
import { ClientSelectComponent } from 'app/shared/components/client-select/client-select.component';
import SimpleIndicatorComponent from 'app/shared/components/simple-indicator/simple-indicator.component';

@Component({
  selector: 'fuse-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  animations: [heightAnimation],
  imports: [
    TableComponent,
    CommonModule,
    NgIcon,
    ButtonModule,
    PopoverModule,
    TagModule,
    FormsModule,
    Tooltip,
    SelectModule,
    PeriodMonthComponent,
    ClientSelectComponent,
    SimpleIndicatorComponent,
  ],
  providers: [OrderState],
})
export class OrderListComponent implements OnInit {
  private router = inject(Router);
  private coreService = inject(CoreService);
  private toast = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private destroyedRef = inject(DestroyRef);
  private orderService = inject(OrderService);
  state = inject(OrderState);
  accountsReceivableState = inject(AccountsReceivableState);

  @ViewChild('name', { static: true }) name!: TemplateRef<any>;
  @ViewChild('payment', { static: true }) payment!: TemplateRef<any>;

  tableConfig = signal<TableConfig>(DEFAULT_TABLE_CONFIG);

  paymentSeverities = signal<any>(PAYMENTS_SITEMAP);

  title = '';

  selectedClient = signal<string | null>(null);

  /** Período atual (setado quando o fuse-period emite). Usado para montar o filtro da API. */
  currentPeriodRange = signal<PeriodRange | null>(null);

  filteredOrderList = computed(() => this.state.orderList());

  constructor() {
    effect(() => {
      this.currentPeriodRange();
      this.selectedClient();
      const range = this.currentPeriodRange();
      if (range) this.loadOrders();
    });
  }

  ngOnInit() {
    this.setTableConfig();
  }

  addNewOrder() {
    this.router.navigate(['dashboard', 'orders', 'new']);
  }

  refreshOrders() {
    this.loadOrders();
  }

  private loadOrders(): void {
    const range = this.currentPeriodRange();
    const clientId = this.selectedClient();
    const filter =
      range || clientId
        ? {
            ...(clientId != null && clientId !== '' && { clientId: Number(clientId) }),
            ...(range?.periodType !== 'all' &&
              range != null && {
                startDate: range.startDate.toISOString().split('T')[0],
                endDate: range.endDate.toISOString().split('T')[0],
              }),
          }
        : undefined;
    this.state.getOrderList(true, false, filter);
  }

  viewOrder(orderData: any) {
    this.router.navigate([
      { outlets: { drawer: ['orders', orderData.id, 'view'] } },
    ]);
  }

  editOrder(orderData: any) {
    this.router.navigate(['dashboard', 'orders', orderData.id]);
  }

  deleteOrder(orderId: string | number) {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja excluir este pedido?',
      header: 'Confirmação de Exclusão',
      icon: 'pi pi-exclamation-triangle text-red-500',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.orderService
          .deleteOrder(orderId)
          .pipe(takeUntilDestroyed(this.destroyedRef))
          .subscribe({
            next: () => {
              const newOrderList = this.state
                .orderList()
                .filter(order => order.id !== orderId);
              this.state.setOrderList(newOrderList);
              this.toast.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Pedido excluído com sucesso',
              });
            },
          });
      },
    });
  }

  onPeriodChange(range: PeriodRange) {
    this.currentPeriodRange.set(range);
  }

  setTableConfig() {
    this.tableConfig.set({
      rowsPerPageOptions: [5, 10, 20],
      rowsPerPage: 10,
      paginator: true,
      pageLinkSize: 5,
      refresh: () => this.refreshOrders(),
      columns: [
        {
          field: 'id',
          caption: 'Cód. Pedido',
          sortable: true,
          filter: true,
          width: '150px',
        },
        {
          field: 'customerName',
          caption: 'Cliente',
          defaultValue: 'Cliente não informado',
          sortable: true,
          filter: true,
        },
        {
          field: 'payments',
          width: '200px',
          align: 'center',
          caption: 'Formas de Pagamento',
          template: this.payment,
        },
        {
          field: 'total',
          caption: 'Valor',
          type: 'currency',
          sortable: true,
          filter: true,
        },
        {
          field: 'createdAt',
          caption: 'Data de Criação',
          type: 'datetime',
          sortable: true,
          filter: true,
        },
        {
          field: 'actions',
          caption: 'Ações',
          actionButtons: [
            {
              icon: 'lucideEye',
              color: 'info',
              variant: 'text',
              tooltip: 'Visualizar Pedido',
              action: data => {
                this.viewOrder(data);
              },
            },
            {
              icon: 'lucideTrash2',
              color: 'warn',
              variant: 'text',
              tooltip: 'Excluir Pedido',
              action: data => {
                this.deleteOrder(data?.id);
              },
            },
          ],
        },
      ],
    });
  }
}
