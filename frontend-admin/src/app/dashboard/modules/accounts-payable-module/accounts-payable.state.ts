import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, lastValueFrom, Subject, tap } from 'rxjs';
import { AccountsPayableService } from './accounts-payable.service';
import { BaseState } from 'app/shared/store/base.state';
import { AccountsPayableModuleState } from 'app/shared/interfaces/accounts-payable/AccountsPayableModuleState';
import { IAccountsPayable } from 'app/shared/interfaces/accounts-payable/AccountsPayable';
import { AccountsPayableStatus } from 'app/shared/interfaces/accounts-payable/AccountsPayableStatus';
import type {
  AccountsPayableListDueRange,
  AccountsPayableListFetchQuery,
  AccountsPayableListStatusParam,
} from 'app/shared/interfaces/accounts-payable/accounts-payable-list-query';

export type {
  AccountsPayableListDueRange,
  AccountsPayableListFetchQuery,
  AccountsPayableListStatusParam,
} from 'app/shared/interfaces/accounts-payable/accounts-payable-list-query';

@Injectable({
  providedIn: 'root',
})
export class AccountsPayableState extends BaseState<AccountsPayableModuleState> {
  private service = inject(AccountsPayableService);

  private listDueDateRange = signal<AccountsPayableListDueRange | null>(null);
  private listStatusFilter = signal<AccountsPayableListStatusParam>('all');

  protected state = signal<AccountsPayableModuleState>({
    accountsPayableList: [],
    loading: false,
    error: null,
  });

  accountsPayableList = computed(() => this.state().accountsPayableList);

  /** Soma dos valores das contas ainda a pagar (pendente, vence em breve, vencido) */
  totalPayable = computed(() =>
    this.accountsPayableList().reduce(
      (sum, item) => (item.status !== 'paid' ? sum + (Number(item.amount) || 0) : sum),
      0
    )
  );

  /** Soma dos valores das contas pagas */
  totalPaid = computed(() =>
    this.accountsPayableList().reduce(
      (sum, item) => (item.status === 'paid' ? sum + (Number(item.amount) || 0) : sum),
      0
    )
  );

  /** Quantidade de contas vencidas */
  overdueCount = computed(() =>
    this.accountsPayableList().filter(item => item.status === 'overdue').length
  );

  private formPrefillSubject = new Subject<Partial<IAccountsPayable>>();
  formPrefill$ = this.formPrefillSubject.asObservable();

  /**
   * `all` = Kanban / lista completa (sem query de datas ou status).
   * Objeto = listagem com intervalo de vencimento e filtro de situação no servidor.
   */
  async getAccountsPayableList(
    skipLoader = true,
    query?: AccountsPayableListFetchQuery | 'all'
  ): Promise<void> {
    if (query === 'all' || query === undefined) {
      this.listDueDateRange.set(null);
      this.listStatusFilter.set('all');
    } else {
      this.listDueDateRange.set({
        startDate: new Date(query.dueDateRange.startDate),
        endDate: new Date(query.dueDateRange.endDate),
      });
      this.listStatusFilter.set(query.status);
    }

    this.setLoading(true);
    this.clearError();
    this.setAccountsPayableList([]);

    const dueRange =
      query !== undefined && query !== 'all' ? query.dueDateRange : undefined;
    const status =
      query !== undefined && query !== 'all' ? query.status : undefined;

    await lastValueFrom(
      this.service.getAll(skipLoader, dueRange, status).pipe(
        tap(data => this.setAccountsPayableList(data.data)),
        catchError(() =>
          this.handleError('Erro ao carregar a lista de contas a pagar')
        ),
        finalize(() => this.setLoading(false))
      )
    );
  }

  async reloadAccountsPayableList(skipLoader = true): Promise<void> {
    const r = this.listDueDateRange();
    const s = this.listStatusFilter();
    if (!r) {
      await this.getAccountsPayableList(skipLoader, 'all');
    } else {
      await this.getAccountsPayableList(skipLoader, {
        dueDateRange: r,
        status: s,
      });
    }
  }

  setAccountsPayableList(list: IAccountsPayable[]) {
    list = list.map(item => {
      item.status = this.determineAccountStatus(item);
      return {
        ...item,
        supplierName: item.supplier?.legalName || 'Fornecedor Desconhecido',
        ...this.convertStatus(item),
      };
    });

    this.updateState('accountsPayableList', list);
  }

  removeAccountPayable(id: number) {
    this.updateState(
      'accountsPayableList',
      this.accountsPayableList().filter(item => item.id !== id)
    );
  }

  updateAccountPayableStatus(id: number, status: AccountsPayableStatus) {
    const updatedList = this.accountsPayableList().map(item => {
      if (item.id === id) {
        return { ...item, status };
      }
      return item;
    });
    this.setAccountsPayableList(updatedList);

    lastValueFrom(
      this.service.updateAccountPayableStatus(id, status).pipe(
        catchError(() => {
          this.handleError('Erro ao atualizar status da conta a pagar');
          return [];
        })
      )
    );
  }

  private determineAccountStatus(
    account: IAccountsPayable
  ): AccountsPayableStatus {
    const now = new Date();
    const dueDate = new Date(account.dueDate);
    const daysDifference = Math.ceil(
      (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (account.status === 'paid') {
      return 'paid';
    }

    if (account.status === 'cancelled') {
      return 'cancelled';
    }

    if (daysDifference < 0) {
      return 'overdue';
    }

    if (daysDifference <= 7) {
      return 'due_soon';
    }

    return 'pending';
  }

  convertStatus(item: IAccountsPayable) {
    const statusMap: Record<
      string,
      { statusLabel: string; statusBadgeColor: string }
    > = {
      pending: {
        statusLabel: 'Pendente',
        statusBadgeColor: 'info',
      },
      paid: {
        statusLabel: 'Pago',
        statusBadgeColor: 'success',
      },
      due_soon: {
        statusLabel: 'Vence em Breve',
        statusBadgeColor: 'warn',
      },
      overdue: {
        statusLabel: 'Vencido',
        statusBadgeColor: 'danger',
      },
      cancelled: {
        statusLabel: 'Cancelado',
        statusBadgeColor: 'secondary',
      },
      unknown: {
        statusLabel: 'Desconhecido',
        statusBadgeColor: 'secondary',
      },
    };

    return statusMap[item?.status || 'unknown'];
  }

  prefillForm(data: Partial<IAccountsPayable>): void {
    this.formPrefillSubject.next(data);
  }

  clearFormPrefill(): void {
    this.formPrefillSubject.next({});
  }
}
