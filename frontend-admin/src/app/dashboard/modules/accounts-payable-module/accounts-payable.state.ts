import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, lastValueFrom, Subject, tap } from 'rxjs';
import { AccountsPayableService } from './accounts-payable.service';
import { BaseState } from 'app/shared/store/base.state';
import { AccountsPayableModuleState } from 'app/shared/interfaces/accounts-payable/AccountsPayableModuleState';
import { IAccountsPayable } from 'app/shared/interfaces/accounts-payable/AccountsPayable';
import { AccountsPayableStatus } from 'app/shared/interfaces/accounts-payable/AccountsPayableStatus';

@Injectable({
  providedIn: 'root',
})
export class AccountsPayableState extends BaseState<AccountsPayableModuleState> {
  private service = inject(AccountsPayableService);

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

  // Subject para pré-preencher o formulário de contas a pagar
  private formPrefillSubject = new Subject<Partial<IAccountsPayable>>();
  formPrefill$ = this.formPrefillSubject.asObservable();

  async getAccountsPayableList(skipLoader = true): Promise<void> {
    this.setLoading(true);
    this.clearError();
    this.setAccountsPayableList([]);

    await lastValueFrom(
      this.service.getAll(skipLoader).pipe(
        tap(data => this.setAccountsPayableList(data.data)),
        catchError(() =>
          this.handleError('Erro ao carregar a lista de contas a pagar')
        ),
        finalize(() => this.setLoading(false))
      )
    );
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
      unknown: {
        statusLabel: 'Desconhecido',
        statusBadgeColor: 'secondary',
      },
    };

    return statusMap[item?.status || 'unknown'];
  }

  /**
   * Emite dados para pré-preencher o formulário de contas a pagar
   * @param data Dados parciais para preencher o formulário
   */
  prefillForm(data: Partial<IAccountsPayable>): void {
    this.formPrefillSubject.next(data);
  }

  /**
   * Limpa os dados de pré-preenchimento
   */
  clearFormPrefill(): void {
    this.formPrefillSubject.next({});
  }
}
