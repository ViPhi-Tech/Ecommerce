import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  TemplateRef,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { CoreService } from 'app/shared/services/core.service';
import { TableComponent } from 'app/shared/components/table/table.component';
import {
  DEFAULT_TABLE_CONFIG,
  TableConfig,
} from 'app/shared/interfaces/table.interfaces';
import { DeliveryState } from '../../delivery.state';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ConfirmationService, MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DeliveryService } from '../../delivery.service';
import { Tooltip } from 'primeng/tooltip';
import { Delivery, DeliveryStatus } from '../../interfaces/delivery.interface';

@Component({
  selector: 'fuse-delivery-list',
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TableComponent,
    CommonModule,
    NgIcon,
    ButtonModule,
    TagModule,
    Tooltip,
  ],
  providers: [DeliveryState],
})
export class DeliveryListComponent implements OnInit {
  private router = inject(Router);
  private coreService = inject(CoreService);
  private toast = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private destroyedRef = inject(DestroyRef);
  private deliveryService = inject(DeliveryService);
  state = inject(DeliveryState);

  @ViewChild('status', { static: true }) status!: TemplateRef<unknown>;
  @ViewChild('orders', { static: true }) orders!: TemplateRef<unknown>;

  tableConfig = signal<TableConfig>(DEFAULT_TABLE_CONFIG);

  statusSeverityMap: Record<DeliveryStatus, string> = {
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
    this.coreService.setPageTitle(
      'Lista de Entregas',
      'Gerencie suas entregas e rotas de forma organizada'
    );
    this.setTableConfig();
    this.state.getDeliveryList();
  }

  addNewDelivery() {
    this.router.navigate(['dashboard', 'deliveries', 'new']);
  }

  refreshDeliveries() {
    this.state.getDeliveryList();
  }

  viewDelivery(deliveryData: Delivery) {
    this.router.navigate([
      { outlets: { drawer: ['deliveries', deliveryData.id, 'view'] } },
    ]);
  }

  viewRoute(deliveryData: Delivery) {
    this.router.navigate(['dashboard', 'deliveries', deliveryData.id, 'route']);
  }

  editDelivery(deliveryData: Delivery) {
    this.router.navigate(['dashboard', 'deliveries', deliveryData.id, 'edit']);
  }

  deleteDelivery(deliveryId: string | number) {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja excluir esta entrega?',
      header: 'Confirmação de Exclusão',
      icon: 'pi pi-exclamation-triangle text-red-500',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.deliveryService
          .deleteDelivery(deliveryId)
          .pipe(takeUntilDestroyed(this.destroyedRef))
          .subscribe({
            next: () => {
              const newDeliveryList = this.state
                .deliveryList()
                .filter(delivery => delivery.id !== deliveryId);
              this.state.setDeliveryList(newDeliveryList);
              this.toast.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Entrega excluída com sucesso',
              });
            },
          });
      },
    });
  }

  generateRoute(deliveryId: string | number) {
    this.state.generateRoute(deliveryId).then(() => {
      this.toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Rota gerada com sucesso',
      });
      this.refreshDeliveries();
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
          caption: 'Cód. Entrega',
          sortable: true,
          filter: true,
          width: '150px',
        },
        {
          field: 'name',
          caption: 'Nome',
          sortable: true,
          filter: true,
        },
        {
          field: 'status',
          caption: 'Status',
          width: '150px',
          align: 'center',
          template: this.status,
        },
        {
          field: 'orders',
          caption: 'Pedidos',
          width: '120px',
          align: 'center',
          template: this.orders,
        },
        {
          field: 'deliveryDate',
          caption: 'Data de Entrega',
          type: 'date',
          sortable: true,
          filter: true,
        },
        {
          field: 'driverName',
          caption: 'Entregador',
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
              tooltip: 'Visualizar Entrega',
              action: (data: Delivery) => {
                this.viewDelivery(data);
              },
            },
            {
              icon: 'lucideMap',
              color: 'primary',
              variant: 'text',
              tooltip: 'Ver Rota',
              action: (data: Delivery) => {
                this.viewRoute(data);
              },
            },
            {
              icon: 'lucideTrash2',
              color: 'warn',
              variant: 'text',
              tooltip: 'Excluir Entrega',
              action: (data: Delivery) => {
                this.deleteDelivery(data.id);
              },
            },
          ],
        },
      ],
    });
  }
}
