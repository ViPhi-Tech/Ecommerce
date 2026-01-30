import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  Signal,
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
import SimpleIndicatorComponent from 'app/shared/components/simple-indicator/simple-indicator.component';

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
    SimpleIndicatorComponent,
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

  statusSeverityMap: Record<DeliveryStatus, 'success' | 'secondary' | 'info' | 'warn' | 'danger'> = {
    [DeliveryStatus.PENDING]: 'warn',
    [DeliveryStatus.SCHEDULED]: 'info',
    [DeliveryStatus.IN_ROUTE]: 'info',
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

  getStatusLabel(status: string | DeliveryStatus | undefined): string {
    if (!status) return 'Desconhecido';
    const statusKey = status as DeliveryStatus;
    return this.statusLabelMap[statusKey] || status;
  }

  getStatusSeverity(status: string | DeliveryStatus | undefined): 'success' | 'secondary' | 'info' | 'warn' | 'danger' {
    if (!status) return 'secondary';
    const statusKey = status as DeliveryStatus;
    return this.statusSeverityMap[statusKey] || 'secondary';
  }

  ngOnInit() {
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
    // Usa UUID se disponível, caso contrário usa o ID
    const identifier = deliveryData.uuid || deliveryData.id;
    if (!identifier) return;
    
    this.router.navigate(['dashboard', 'deliveries', identifier, 'route']);
  }

  editDelivery(deliveryData: Delivery) {
    this.router.navigate(['dashboard', 'deliveries', deliveryData.id, 'edit']);
  }

  private isUuid(value: string | number): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(String(value));
  }

  private async findUuidById(id: string | number): Promise<string | null> {
    try {
      // Busca na lista de entregas para encontrar o UUID correspondente ao ID
      const deliveries = this.state.deliveryList();
      const delivery = deliveries.find(d => 
        d.id === id || 
        d.id?.toString() === id?.toString() ||
        d.id?.toString() === String(id)
      );
      if (delivery?.uuid) {
        return delivery.uuid;
      }
      
      // Se não encontrar na lista em cache, busca a entrega pelo ID para obter o UUID
      try {
        const deliveryData = await this.state.getDeliveryById(id);
        if (deliveryData?.uuid) {
          return deliveryData.uuid;
        }
      } catch (err) {
        console.error('Erro ao buscar entrega pelo ID:', err);
      }
      
      return null;
    } catch (err) {
      console.error('Erro ao buscar UUID:', err);
      return null;
    }
  }

  async cancelDelivery(deliveryData: Delivery) {
    if (!deliveryData) return;

    try {
      console.log('cancelDelivery - deliveryData:', deliveryData);
      console.log('cancelDelivery - deliveryData.uuid:', deliveryData.uuid);
      console.log('cancelDelivery - deliveryData.id:', deliveryData.id);
      
      // Sempre busca o UUID do backend para garantir que temos o UUID correto
      let uuid: string | null = null;
      
      // Primeiro tenta usar o UUID do deliveryData se for válido
      if (deliveryData.uuid && this.isUuid(deliveryData.uuid)) {
        uuid = deliveryData.uuid;
        console.log('UUID encontrado no deliveryData:', uuid);
      } else {
        // Se não tiver UUID válido, busca pelo ID
        console.log('UUID não encontrado ou inválido, buscando pelo ID...');
        uuid = await this.findUuidById(deliveryData.id);
        console.log('UUID encontrado pelo ID:', uuid);
      }
      
      // Se ainda não encontrou, tenta buscar a entrega completa pelo ID
      if (!uuid || !this.isUuid(uuid)) {
        console.log('Tentando buscar entrega completa pelo ID para obter UUID...');
        try {
          const fullDelivery = await this.state.getDeliveryById(deliveryData.id);
          if (fullDelivery?.uuid && this.isUuid(fullDelivery.uuid)) {
            uuid = fullDelivery.uuid;
            console.log('UUID obtido da entrega completa:', uuid);
          }
        } catch (err) {
          console.error('Erro ao buscar entrega completa:', err);
        }
      }

      // Validação final
      if (!uuid || !this.isUuid(uuid)) {
        console.error('UUID inválido após todas as tentativas:', uuid);
        this.toast.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível obter o UUID da entrega. Tente novamente.',
        });
        return;
      }

      console.log('Enviando cancelamento com UUID:', uuid);
      await this.state.cancelDelivery(uuid);
      this.toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Entrega cancelada com sucesso',
      });
      this.refreshDeliveries();
    } catch (error: any) {
      console.error('Erro ao cancelar entrega:', error);
      this.toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: error?.error?.description || error?.message || 'Erro ao cancelar entrega',
      });
    }
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
      refresh: () => this.refreshDeliveries(),
      rowClass: (rowData: Delivery) => {
        if (rowData.status === 'CANCELLED') {
          return 'bg-red-50 dark:bg-red-900/20';
        }
        return '';
      },
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
              icon: 'lucideX',
              color: 'danger',
              variant: 'text',
              tooltip: 'Cancelar Entrega',
              colorIcon: '#EF4444',
              action: (data: Delivery) => {
                this.cancelDelivery(data);
              },
            },
          ],
        },
      ],
    });
  }
}
