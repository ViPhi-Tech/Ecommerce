import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  TemplateRef,
  ViewChild,
  computed,
  effect,
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
import PeriodComponent, { PeriodRange } from 'app/shared/components/period/period.component';
import { CurrencyPipe } from '@angular/common';
import { ClientState } from '../../../client-module/client.state';
import { AccountsReceivableState } from 'app/dashboard/modules/accounts-receivable-module/accounts-receivable.state';

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
    PeriodComponent,
    CurrencyPipe,
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
  clientState = inject(ClientState);
  accountsReceivableState = inject(AccountsReceivableState);

  @ViewChild('name', { static: true }) name!: TemplateRef<any>;
  @ViewChild('payment', { static: true }) payment!: TemplateRef<any>;

  tableConfig = signal<TableConfig>(DEFAULT_TABLE_CONFIG);

  title = '';

  selectedClient = signal<string | null>(null);
  selectedData = signal<any[]>([]);

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
    if (!selectedClient) return orders;
    return orders.filter(order => order.client?.fullName === selectedClient);
  });

  selectedSummary = computed(() => {
    const selected = this.selectedData();
    const count = selected.length;
    const totalAmount = selected.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
    const pendingCount = selected.filter((o: any) => o.status === 'PENDING').length;
    const paidCount = selected.filter((o: any) => o.status === 'PAID').length;
    const cancelledCount = selected.filter((o: any) => o.status === 'CANCELLED').length;
    return { count, totalAmount, pendingCount, paidCount, cancelledCount };
  });

  constructor() {
    // Liga/desliga seleção múltipla baseado no cliente selecionado
    effect(() => {
      const hasClientSelected = !!this.selectedClient();
      const currentConfig = this.tableConfig();
      const hasSelection = !!currentConfig?.selection?.mode;

      if (hasClientSelected && !hasSelection) {
        this.tableConfig.set({ ...currentConfig, selection: { mode: 'multiple' } });
      }

      if (!hasClientSelected && hasSelection) {
        const next: any = { ...currentConfig };
        delete next.selection;
        this.tableConfig.set(next as TableConfig);
      }
    });
  }

  ngOnInit() {
    this.coreService.setPageTitle(
      'Lista de Pedidos',
      'Listagem com os pedidos realizados'
    );
    this.setTableConfig();
    this.state.getOrderList();
    this.clientState.getClientList();
  }

  

  addNewOrder() {
    this.router.navigate(['dashboard', 'orders', 'new']);
  }

  refreshOrders() {
    this.state.getOrderList();
  }

  viewOrder(orderData: any) {
    this.router.navigate([
      { outlets: { drawer: ['orders', orderData.id, 'view'] } },
    ]);
  }

  editOrder(orderData: any) {
    this.router.navigate(['dashboard', 'orders', orderData.id]);
  }

  onClientChange(clientName: string | null) {
    this.selectedClient.set(clientName);
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
              this.toast.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Pedido excluído com sucesso',
              });
              this.state.getOrderList();
            },
            error: () => {
              this.toast.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao excluir pedido',
              });
            },
          });
      },
    });
  }

  onPeriodChange(range: PeriodRange) {
    // TODO: Filtrar pedidos por período se necessário
    console.log('Período selecionado:', range);
  }

  convertToAccountsReceivable(orderId?: number | string) {
    const order = this.state.orderList().find(o => o.id === orderId);
    const selected = order ? [order] : this.selectedData();

    if (selected.length === 0) {
      this.toast.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Selecione pelo menos um pedido para converter',
      });
      return;
    }

    const hasNoClient = selected.some(o => !o?.client);
    if (hasNoClient) {
      this.toast.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Todos os pedidos devem ter um cliente associado para converter',
      });
      return;
    }

    const firstClient = selected[0]?.client?.id;
    const allSameClient = selected.every(o => o?.client?.id === firstClient);
    if (!allSameClient) {
      this.toast.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Todos os pedidos devem ser do mesmo cliente para converter',
      });
      return;
    }

    const accountReceivableTotal = selected.reduce(
      (sum: number, o: any) => sum + (o?.total || 0),
      0
    );

    const formData = {
      orders: selected,
      amount: accountReceivableTotal,
      clientId: firstClient,
    } as any;

    this.router.navigate([{ outlets: { drawer: ['accounts-receivable', 'new'] } }]);
    setTimeout(() => {
      this.accountsReceivableState.prefillForm(formData);
    }, 100);
  }

  setTableConfig() {
    this.tableConfig.set({
      rowsPerPageOptions: [5, 10, 20],
      rowsPerPage: 10,
      paginator: true,
      pageLinkSize: 5,
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
          sortable: true,
          filter: true,
        },
        {
          field: 'payments',
          width: '150px',
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
              icon: 'lucideArrowRight',
              color: 'success',
              variant: 'text',
              tooltip: 'Converter em Conta a Receber',
              action: (data: any) => {
                this.convertToAccountsReceivable(data?.id);
              },
            },
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
              action: (data) => {
                this.deleteOrder(data?.id);
              },
            },
          ],
        },
      ],
    });
  }
}
