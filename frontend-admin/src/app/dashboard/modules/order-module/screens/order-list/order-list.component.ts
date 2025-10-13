import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { CoreService } from 'app/shared/services/core.service';
import { TableComponent } from 'app/shared/components/table/table.component';
import {
  DEFAULT_TABLE_CONFIG,
  TableConfig,
} from 'app/shared/interfaces/table.interfaces';
import { TableFilterComponent } from 'app/shared/components/table/components/table-filter/table-filter.component';
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

@Component({
  selector: 'fuse-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  animations: [heightAnimation],
  imports: [
    TableComponent,
    TableFilterComponent,
    CommonModule,
    NgIcon,
    ButtonModule, 
    PopoverModule,
    TagModule,
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

  @ViewChild('name', { static: true }) name!: TemplateRef<any>;
  @ViewChild('payment', { static: true }) payment!: TemplateRef<any>;

  tableConfig = signal<TableConfig>(DEFAULT_TABLE_CONFIG);

  title = '';

  constructor() {}

  ngOnInit() {
    this.coreService.setPageTitle(
      'Lista de Pedidos',
      'Listagem com os pedidos realizados'
    );
    this.setTableConfig();
    this.state.getOrderList();
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
