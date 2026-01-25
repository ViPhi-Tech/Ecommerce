import {
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { CoreService } from 'app/shared/services/core.service';
import { TableComponent } from 'app/shared/components/table/table.component';
import { TableConfig } from 'app/shared/interfaces/table.interfaces';
import { TableFilterComponent } from 'app/shared/components/table/components/table-filter/table-filter.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ServiceOrderService } from '../../service-order.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { heightAnimation } from 'app/shared/utils/animations';
import { NgIcon } from '@ng-icons/core';
import { ButtonModule } from 'primeng/button';
import { ServiceOrderState } from '../../service-order.state';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'fuse-service-order-list',
  templateUrl: './service-order-list.component.html',
  styleUrls: ['./service-order-list.component.scss'],
  animations: [heightAnimation],
  imports: [
    TableComponent,
    TableFilterComponent,
    NgIcon,
    ButtonModule,
    NgTemplateOutlet,
  ],
})
export class ServiceOrderListComponent implements OnInit {
  private router = inject(Router);
  private coreService = inject(CoreService);
  private toast = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private serviceOrderService = inject(ServiceOrderService);
  private destroyedRef = inject(DestroyRef);

  state = inject(ServiceOrderState);

  tableConfig = signal<TableConfig>({
    rowsPerPageOptions: [5, 10, 20],
    rowsPerPage: 10,
    paginator: true,
    pageLinkSize: 5,
    refresh: () => this.refreshServiceOrders(),
    columns: [
      { field: 'id', caption: 'ID', sortable: true, filter: true },
      { field: 'client', caption: 'Cliente', sortable: true, filter: true },
      {
        field: 'description',
        caption: 'Descrição',
        sortable: true,
        filter: true,
      },
      { field: 'status', caption: 'Status', sortable: true, filter: true },
      {
        field: 'priority',
        caption: 'Prioridade',
        sortable: true,
        filter: true,
      },
      {
        field: 'createdDate',
        caption: 'Data de Criação',
        sortable: true,
        filter: true,
      },
      {
        field: 'actions',
        caption: 'Ações',
        actionButtonsType: 'buttons',
        actionButtons: [
          {
            icon: 'lucideSquarePen',
            label: 'Editar',
            tooltip: 'Editar Ordem de Serviço',
            variant: 'text',
            action: (rowData: any) => {
              this.editServiceOrder(rowData?.id);
            },
          },
          {
            icon: 'lucideTrash2',
            label: 'Excluir',
            variant: 'text',
            colorText: '#EF4444',
            colorIcon: '#EF4444',
            tooltip: 'Excluir Ordem de Serviço',
            action: (rowData: any) => {
              this.deleteServiceOrder(rowData?.id);
            },
          },
        ],
      },
    ],
  });

  constructor() {
    effect(() => {
      if (this.serviceOrderService.refreshServiceOrderList$()) {
        this.state.getServiceOrderList();
      }
    });
  }

  ngOnInit() {
    this.state.getServiceOrderList();
  }

  addNewServiceOrder() {
    this.router.navigate([{ outlets: { drawer: ['service-orders', 'new'] } }]);
  }

  refreshServiceOrders() {
    this.state.getServiceOrderList();
  }

  editServiceOrder(serviceOrderId: string) {
    this.router.navigate([
      { outlets: { drawer: ['service-orders', serviceOrderId] } },
    ]);
  }

  deleteServiceOrder(serviceOrderId: string) {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja excluir esta ordem de serviço?',
      header: 'Confirmação de Exclusão',
      icon: 'pi pi-exclamation-triangle text-red-500',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.serviceOrderService
          .deleteServiceOrder(serviceOrderId)
          .pipe(takeUntilDestroyed(this.destroyedRef))
          .subscribe({
            next: () => {
              this.toast.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Ordem de serviço excluída com sucesso',
              });
              this.serviceOrderService.refreshServiceOrderList$();
            },
            error: () => {
              this.toast.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao excluir ordem de serviço',
              });
            },
          });
      },
    });
  }
}
