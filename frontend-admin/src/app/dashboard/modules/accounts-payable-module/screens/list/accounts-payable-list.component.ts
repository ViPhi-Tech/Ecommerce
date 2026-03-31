import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  Signal,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { CoreService } from 'app/shared/services/core.service';
import { TableConfig } from 'app/shared/interfaces/table.interfaces';
import { ConfirmationService, MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { heightAnimation } from 'app/shared/utils/animations';
import { TableComponent } from 'app/shared/components/table/table.component';
import { ButtonModule } from 'primeng/button';
import { AccountsPayableService } from '../../accounts-payable.service';
import { AccountsPayableState } from '../../accounts-payable.state';
import { IAccountsPayable } from 'app/shared/interfaces/accounts-payable/AccountsPayable';
import { CommonModule } from '@angular/common';
import SimpleIndicatorComponent from 'app/shared/components/simple-indicator/simple-indicator.component';
import { buildPeriodRange } from 'app/shared/utils/period-range';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { SelectModule } from 'primeng/select';
import dayjs from 'dayjs';
import type {
  AccountsPayableListDueRange,
  AccountsPayableListStatusParam,
} from 'app/shared/interfaces/accounts-payable/accounts-payable-list-query';

const LS_FILTERS_KEY = 'payable_list_filters';
const LS_LEGACY_PERIOD_KEY = 'payable_list_period';

@Component({
  selector: 'fuse-accounts-payable-list',
  templateUrl: './accounts-payable-list.component.html',
  animations: [heightAnimation],
  imports: [
    TableComponent,
    ButtonModule,
    CommonModule,
    SimpleIndicatorComponent,
    DatePickerModule,
    FormsModule,
    TooltipModule,
    SelectModule,
  ],
})
export class AccountsPayableListComponent implements OnInit {
  private router = inject(Router);
  private coreService = inject(CoreService);
  private toast = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private accountsPayableService = inject(AccountsPayableService);
  private destroyedRef = inject(DestroyRef);

  state = inject(AccountsPayableState);

  readonly statusOptions: { label: string; value: AccountsPayableListStatusParam }[] =
    [
      { label: 'Todos', value: 'all' },
      { label: 'Pendente', value: 'pending' },
      { label: 'Pago', value: 'paid' },
      { label: 'Vencido', value: 'overdue' },
      { label: 'Vence em breve', value: 'due_soon' },
      { label: 'Cancelado', value: 'cancelled' },
    ];

  dueDateRange = signal<AccountsPayableListDueRange>(
    (() => {
      const d = buildPeriodRange('currentMonth');
      return { startDate: d.startDate, endDate: d.endDate };
    })()
  );

  statusFilter = signal<AccountsPayableListStatusParam>('all');

  calendarRangeModel: Date[] | null = null;

  tableConfig = signal<TableConfig>({
    rowsPerPageOptions: [5, 10, 20],
    rowsPerPage: 10,
    paginator: true,
    pageLinkSize: 5,
    exportSort: { field: 'dueDate', order: 'asc' },
    refresh: () => this.loadAccountsPayable(),
    columns: [
      {
        field: 'supplierName',
        caption: 'Fornecedor',
        sortable: true,
        filter: true,
      },
      {
        field: 'description',
        caption: 'Descrição',
      },
      {
        field: 'dueDate',
        caption: 'Data de Vencimento',
        filter: true,
        sortable: true,
        type: 'date',
      },
      {
        field: 'amount',
        caption: 'Valor',
        type: 'currency',
        sortable: true,
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
            label: 'Marcar como Pendente/Vencido',
            colorIcon: '#FACC15',
            tooltip: 'Marcar como Pendente/Vencido',
            variant: 'text',
            show: (rowData: Signal<IAccountsPayable>) => {
              return rowData().status === 'paid';
            },
            action: (rowData: IAccountsPayable) => {
              this.markAsPendingOrOverdue(rowData?.id);
            },
          },
          {
            icon: 'lucideCircleCheckBig',
            label: 'Dar Baixa',
            tooltip: 'Dar Baixa na Conta a Pagar',
            colorIcon: '#22C55E',
            variant: 'text',
            show: (rowData: Signal<IAccountsPayable>) => {
              return rowData().status !== 'paid';
            },
            action: (rowData: IAccountsPayable) => {
              this.markAsPaid(rowData?.id);
            },
          },
          {
            icon: 'lucideSquarePen',
            label: 'Editar',
            tooltip: 'Editar Conta a Pagar',
            colorIcon: '#3B82F6',
            variant: 'text',
            action: (rowData: IAccountsPayable) => {
              this.edit(rowData?.id);
            },
          },
          {
            icon: 'lucideTrash2',
            label: 'Excluir',
            variant: 'text',
            colorText: '#EF4444',
            colorIcon: '#EF4444',
            tooltip: 'Excluir Conta a Pagar',
            action: (rowData: IAccountsPayable) => {
              this.delete(rowData?.id);
            },
          },
        ],
      },
    ],
  });

  ngOnInit() {
    localStorage.setItem('accounts-payable-view-preference', 'list');
    this.hydrateFiltersFromStorage();
    this.loadAccountsPayable();
  }

  private hydrateFiltersFromStorage(): void {
    const raw = localStorage.getItem(LS_FILTERS_KEY);
    if (raw) {
      try {
        const p = JSON.parse(raw) as {
          startDate: string;
          endDate: string;
          status?: AccountsPayableListStatusParam;
        };
        const dr: AccountsPayableListDueRange = {
          startDate: new Date(p.startDate),
          endDate: new Date(p.endDate),
        };
        this.dueDateRange.set(dr);
        this.calendarRangeModel = [dr.startDate, dr.endDate];
        if (p.status && this.isValidStatus(p.status)) {
          this.statusFilter.set(p.status);
        }
        return;
      } catch {
        /* fallthrough */
      }
    }

    const legacy = localStorage.getItem(LS_LEGACY_PERIOD_KEY);
    if (legacy) {
      try {
        const p = JSON.parse(legacy) as {
          startDate: string;
          endDate: string;
        };
        const dr: AccountsPayableListDueRange = {
          startDate: new Date(p.startDate),
          endDate: new Date(p.endDate),
        };
        this.dueDateRange.set(dr);
        this.calendarRangeModel = [dr.startDate, dr.endDate];
        this.persistFiltersToStorage();
        return;
      } catch {
        /* fallthrough */
      }
    }

    const d = buildPeriodRange('currentMonth');
    const dr = { startDate: d.startDate, endDate: d.endDate };
    this.dueDateRange.set(dr);
    this.calendarRangeModel = [dr.startDate, dr.endDate];
    this.persistFiltersToStorage();
  }

  private isValidStatus(v: string): v is AccountsPayableListStatusParam {
    return this.statusOptions.some(o => o.value === v);
  }

  private persistFiltersToStorage(): void {
    const dr = this.dueDateRange();
    localStorage.setItem(
      LS_FILTERS_KEY,
      JSON.stringify({
        startDate: dr.startDate.toISOString(),
        endDate: dr.endDate.toISOString(),
        status: this.statusFilter(),
      })
    );
  }

  onStatusFilterChange(value: AccountsPayableListStatusParam | null): void {
    if (value === null || value === undefined) return;
    this.statusFilter.set(value);
    this.persistFiltersToStorage();
    this.loadAccountsPayable();
  }

  onCalendarRangeChange(value: Date | Date[] | null): void {
    const dates = Array.isArray(value)
      ? value.filter((d): d is Date => d instanceof Date)
      : [];
    if (dates.length < 2) return;
    const cur = this.dueDateRange();
    if (
      dayjs(cur.startDate).isSame(dayjs(dates[0]), 'day') &&
      dayjs(cur.endDate).isSame(dayjs(dates[1]), 'day')
    ) {
      return;
    }
    this.dueDateRange.set({
      startDate: dates[0],
      endDate: dates[1],
    });
    this.calendarRangeModel = [dates[0], dates[1]];
    this.persistFiltersToStorage();
    this.loadAccountsPayable();
  }

  loadAccountsPayable(): void {
    const dr = this.dueDateRange();
    void this.state.getAccountsPayableList(true, {
      dueDateRange: {
        startDate: new Date(dr.startDate),
        endDate: new Date(dr.endDate),
      },
      status: this.statusFilter(),
    });
  }

  async markAsPendingOrOverdue(id: number) {
    this.confirmationService.confirm({
      message:
        'Você tem certeza que deseja marcar como pendente/vencido esta conta a pagar?',
      header: 'Confirmação de Marcação',
      icon: 'pi pi-exclamation-triangle text-yellow-500',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-warning',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.coreService.showLoader();
        this.accountsPayableService
          .updateAccountPayableStatus(id, 'pending', false)
          .pipe(
            takeUntilDestroyed(this.destroyedRef),
            finalize(() => this.coreService.hideLoader())
          )
          .subscribe({
            next: () => {
              this.toast.add({
                severity: 'success',
                summary: 'Sucesso',
                detail:
                  'Conta a pagar marcada como pendente/vencido com sucesso',
              });
              this.state.updateAccountPayableStatus(id, 'pending');
            },
            error: () => {
              this.toast.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao atualizar status da conta a pagar',
              });
            },
          });
      },
    });
  }

  async markAsPaid(id: number) {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja dar baixa nesta conta a pagar?',
      header: 'Confirmação de Baixa',
      icon: 'pi pi-exclamation-triangle text-yellow-500',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.coreService.showLoader();
        this.accountsPayableService
          .updateAccountPayableStatus(id, 'paid', false)
          .pipe(
            takeUntilDestroyed(this.destroyedRef),
            finalize(() => this.coreService.hideLoader())
          )
          .subscribe({
            next: () => {
              this.toast.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Conta a pagar marcada como paga com sucesso',
              });
              this.state.updateAccountPayableStatus(id, 'paid');
            },
            error: () => {
              this.toast.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao dar baixa na conta a pagar',
              });
            },
          });
      },
    });
  }

  addNewAccount() {
    this.router.navigate([
      { outlets: { drawer: ['accounts-payable', 'new'] } },
    ]);
  }

  edit(id: number) {
    this.router.navigate([{ outlets: { drawer: ['accounts-payable', id] } }]);
  }

  delete(id: number) {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja excluir esta conta a pagar?',
      header: 'Confirmação de Exclusão',
      icon: 'pi pi-exclamation-triangle text-red-500',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.coreService.showLoader();
        this.accountsPayableService
          .delete(id)
          .pipe(
            takeUntilDestroyed(this.destroyedRef),
            finalize(() => this.coreService.hideLoader())
          )
          .subscribe({
            next: () => {
              this.toast.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Conta a pagar excluída com sucesso',
              });
              this.state.removeAccountPayable(id);
            },
            error: () => {
              this.toast.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao excluir conta a pagar',
              });
            },
          });
      },
    });
  }

  navigateToKanban() {
    localStorage.setItem('accounts-payable-view-preference', 'kanban');
    this.router.navigate(['/dashboard/accounts-payable/kanban']);
  }
}
