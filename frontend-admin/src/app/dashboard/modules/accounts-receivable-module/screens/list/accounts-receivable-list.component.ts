import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  computed,
  Signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { CoreService } from 'app/shared/services/core.service';
import { TableConfig } from 'app/shared/interfaces/table.interfaces';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AccountsReceivableService } from '../../accounts-receivable.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { heightAnimation } from 'app/shared/utils/animations';
import { AccountsReceivableState } from '../../accounts-receivable.state';
import { TableComponent } from 'app/shared/components/table/table.component';
import { ButtonModule } from 'primeng/button';
import { ClientSelectComponent } from 'app/shared/components/client-select/client-select.component';
import PeriodComponent, {
  PeriodRange,
} from 'app/shared/components/period/period.component';
import dayjs from 'dayjs';
import { IAccountsReceivable } from 'app/shared/interfaces/accounts-receivable/AccountsReceivable';

@Component({
  selector: 'fuse-accounts-receivable-list',
  templateUrl: './accounts-receivable-list.component.html',
  animations: [heightAnimation],
  imports: [
    TableComponent,
    ButtonModule,
    ClientSelectComponent,
    PeriodComponent,
  ],
})
export class AccountsReceivableListComponent implements OnInit {
  private router = inject(Router);
  private coreService = inject(CoreService);
  private toast = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private accountsReceivableService = inject(AccountsReceivableService);
  private destroyedRef = inject(DestroyRef);

  state = inject(AccountsReceivableState);

  // Filtros
  selectedClientId: string | null = null;
  currentPeriodRange: PeriodRange | null = null;

  // Computed signals
  filteredAccountsReceivable = computed(() => {
    let accounts = this.state.accountsReceivableList();

    // Filtro por cliente (apenas frontend)
    if (this.selectedClientId) {
      accounts = accounts.filter(
        account => account.client?.id === this.selectedClientId
      );
    }

    return accounts;
  });

  tableConfig = signal<TableConfig>({
    rowsPerPageOptions: [5, 10, 20],
    rowsPerPage: 10,
    paginator: true,
    pageLinkSize: 5,
    columns: [
      {
        field: 'clientName',
        caption: 'Cliente',
        sortable: true,
        filter: true,
      },
      {
        field: 'description',
        caption: 'Descrição',
        sortable: true,
        filter: true,
      },
      {
        field: 'dueDate',
        caption: 'Data de Vencimento',
        type: 'date',
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
        field: 'statusLabel',
        caption: 'Situação',
        type: 'badge',
        filter: true,
        sortable: true,
        badgeSeverityKey: 'statusBadgeColor',
        align: 'center',
      },
      {
        field: 'actions',
        caption: 'Ações',
        actionButtonsType: 'buttons',
        actionButtons: [
          {
            icon: 'lucideCalendarClock',
            label: 'Marcar como Pendente/Vencido' ,
            colorIcon: '#FACC15',
            tooltip: 'Marcar como Pendente/Vencido',
            variant: 'text',
            show: (rowData: Signal<IAccountsReceivable>) => {
              return rowData().status === 'received';
            },
            action: (rowData: IAccountsReceivable) => {
              this.markAsPendingOrOverdue(rowData?.id);
            },
          },
          {
            icon: 'lucideCircleCheckBig',
            label: 'Dar Baixa ',
            colorIcon: '#22C55E',
            tooltip: 'Dar Baixa na Conta a Receber',
            variant: 'text',
            show: (rowData: Signal<IAccountsReceivable>) => {
              return rowData().status !== 'received';
            },
            action: (rowData: IAccountsReceivable) => {
              this.markAsReceived(rowData?.id);
            },
          },
          {
            icon: 'lucideSquarePen',
            label: 'Editar',
            tooltip: 'Editar Conta a Receber',
            colorIcon: '#3B82F6',
            variant: 'text',
            action: (rowData: any) => {
              this.edit(rowData?.id);
            },
          },
          {
            icon: 'lucideTrash2',
            label: 'Excluir',
            variant: 'text',
            colorText: '#EF4444',
            colorIcon: '#EF4444',
            tooltip: 'Excluir Conta a Receber',
            action: (rowData: any) => {
              this.delete(rowData?.id);
            },
          },
        ],
      },
    ],
  });

  constructor() {}

  async ngOnInit() {
    // Salvar preferência atual como lista
    localStorage.setItem('accounts-receivable-view-preference', 'list');

    // this.loadAccountsReceivable();

    this.coreService.setPageTitle(
      'Contas a Receber',
      'Lista de contas a receber'
    );
  }

  async loadAccountsReceivable() {
    const dateFilter = this.getDateFilter();
    await this.state.getAccountsReceivableList(true, dateFilter);
  }

  // Métodos dos filtros
  onPeriodChange(periodRange: PeriodRange): void {
    this.currentPeriodRange = periodRange;
    // O filtro de data é enviado para o backend
    this.loadAccountsReceivable();
  }

  clearFilters(): void {
    this.selectedClientId = null;
    this.currentPeriodRange = null;

    // Recarregar dados sem filtros
    this.loadAccountsReceivable();

    // Mostrar mensagem de feedback
    this.toast.add({
      severity: 'info',
      summary: 'Filtros Limpos',
      detail: 'Todos os filtros foram removidos',
    });
  }

  private getDateFilter():
    | { startDate?: string; endDate?: string }
    | undefined {
    if (!this.currentPeriodRange) {
      return undefined;
    }

    return {
      startDate: dayjs(this.currentPeriodRange.startDate).format('YYYY-MM-DD'),
      endDate: dayjs(this.currentPeriodRange.endDate).format('YYYY-MM-DD'),
    };
  }

  async markAsPendingOrOverdue(id: number) {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja marcar como pendente/vencido esta conta a receber?',
      header: 'Confirmação de Marcação',
      icon: 'pi pi-exclamation-triangle text-yellow-500',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.state.updateAccountReceivableStatus(id, 'pending');
      },
    });
  }

  // Método para dar baixa na conta a receber
  async markAsReceived(id: number) {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja dar baixa nesta conta a receber?',
      header: 'Confirmação de Baixa',
      icon: 'pi pi-exclamation-triangle text-yellow-500',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.state.updateAccountReceivableStatus(id, 'received');
      },
    });
  }

  navigateToKanban() {
    // Salvar preferência de visualização
    localStorage.setItem('accounts-receivable-view-preference', 'kanban');
    this.router.navigate(['/dashboard/accounts-receivable/kanban']);
  }

  addNewAccount() {
    this.router.navigate([
      { outlets: { drawer: ['accounts-receivable', 'new'] } },
    ]);
  }

  edit(id: string) {
    this.router.navigate([
      { outlets: { drawer: ['accounts-receivable', id] } },
    ]);
  }

  delete(id: string) {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja excluir esta conta a receber?',
      header: 'Confirmação de Exclusão',
      icon: 'pi pi-exclamation-triangle text-red-500',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.state.removeAccountReceivable(Number(id));
        this.accountsReceivableService
          .delete(id, true)
          .pipe(takeUntilDestroyed(this.destroyedRef))
          .subscribe({
            next: () => {
              this.toast.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Conta a receber excluída com sucesso',
              });
            },
            error: () => {
              this.loadAccountsReceivable();
              this.toast.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao excluir conta a receber',
              });
            },
          });
      },
    });
  }
}
