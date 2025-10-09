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
import { DebtService } from '../../debt.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { heightAnimation } from 'app/shared/utils/animations';
import { NgIcon } from '@ng-icons/core';
import { ButtonModule } from 'primeng/button';
import { DebtState } from '../../debt.state';
import {
  CurrencyPipe,
  DatePipe,
  NgClass,
  NgTemplateOutlet,
} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tooltip } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'fuse-debt-list',
  templateUrl: './debt-list.component.html',
  styleUrls: ['./debt-list.component.scss'],
  animations: [heightAnimation],
  imports: [
    TableComponent,
    TableFilterComponent,
    NgIcon,
    ButtonModule,
    NgTemplateOutlet,
    CurrencyPipe,
    DatePipe,
    Tooltip,
    TagModule,
    NgClass,
    FormsModule,
  ],
})
export class DebtListComponent implements OnInit {
  private router = inject(Router);
  private coreService = inject(CoreService);
  private toast = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private debtService = inject(DebtService);
  private destroyedRef = inject(DestroyRef);

  state = inject(DebtState);

  tableConfig = signal<TableConfig>({
    rowsPerPageOptions: [5, 10, 20],
    rowsPerPage: 10,
    paginator: true,
    pageLinkSize: 5,
    columns: [
      { field: 'id', caption: 'ID', sortable: true, filter: true },
      { field: 'title', caption: 'Título', sortable: true, filter: true },
      {
        field: 'creditorName',
        caption: 'Credor',
        sortable: true,
        filter: true,
      },
      {
        field: 'amount',
        caption: 'Valor',
        type: 'currency',
        sortable: true,
        filter: true,
      },
      {
        field: 'dueDate',
        caption: 'Vencimento',
        type: 'date',
        sortable: true,
        filter: true,
      },
      {
        field: 'status',
        caption: 'Status',
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
            tooltip: 'Editar Dívida',
            variant: 'text',
            action: (rowData: any) => {
              this.editDebt(rowData?.id);
            },
          },
          {
            icon: 'lucideCheckCircle',
            label: 'Pagar',
            variant: 'text',
            colorText: '#10B981',
            colorIcon: '#10B981',
            tooltip: 'Marcar como Paga',
            action: (rowData: any) => {
              if (rowData?.status !== 'paid') {
                this.markAsPaid(rowData?.id);
              }
            },
          },
          {
            icon: 'lucideTrash2',
            label: 'Excluir',
            variant: 'text',
            colorText: '#EF4444',
            colorIcon: '#EF4444',
            tooltip: 'Excluir Dívida',
            action: (rowData: any) => {
              this.deleteDebt(rowData?.id);
            },
          },
        ],
      },
    ],
  });

  statusOptions = signal([
    { label: 'Todos', value: 'all' },
    { label: 'Pendente', value: 'pending' },
    { label: 'Paga', value: 'paid' },
    { label: 'Vencida', value: 'overdue' },
    { label: 'Cancelada', value: 'cancelled' },
  ]);

  constructor() {
    effect(() => {
      if (this.debtService.refreshDebtList$()) {
        this.state.getDebtList();
      }
    });
  }

  ngOnInit() {
    this.state.getDebtList();
    this.coreService.setPageTitle(
      'Dívidas',
      'Gestão de dívidas e contas a pagar'
    );
  }

  addNewDebt() {
    this.router.navigate([{ outlets: { drawer: ['debts', 'new'] } }]);
  }

  refreshDebts() {
    this.state.getDebtList();
  }

  editDebt(debtId: string) {
    this.router.navigate([{ outlets: { drawer: ['debts', debtId] } }]);
  }

  markAsPaid(debtId: string) {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja marcar esta dívida como paga?',
      header: 'Confirmação de Pagamento',
      icon: 'pi pi-check-circle text-green-500',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.debtService
          .markAsPaid(debtId)
          .pipe(takeUntilDestroyed(this.destroyedRef))
          .subscribe({
            next: () => {
              this.toast.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Dívida marcada como paga com sucesso',
              });
              this.debtService.refreshDebtList();
            },
            error: () => {
              this.toast.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao marcar dívida como paga',
              });
            },
          });
      },
    });
  }

  deleteDebt(debtId: string) {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja excluir esta dívida?',
      header: 'Confirmação de Exclusão',
      icon: 'pi pi-exclamation-triangle text-red-500',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.debtService
          .deleteDebt(debtId)
          .pipe(takeUntilDestroyed(this.destroyedRef))
          .subscribe({
            next: () => {
              this.toast.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Dívida excluída com sucesso',
              });
              this.debtService.refreshDebtList();
            },
            error: () => {
              this.toast.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao excluir dívida',
              });
            },
          });
      },
    });
  }

  getStatusSeverity(status: string): 'success' | 'warn' | 'danger' | 'info' {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'info';
      case 'overdue':
        return 'danger';
      case 'cancelled':
        return 'warn';
      default:
        return 'info';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'paid':
        return 'Paga';
      case 'pending':
        return 'Pendente';
      case 'overdue':
        return 'Vencida';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  }
}
