import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, lastValueFrom, tap } from 'rxjs';
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

  async getAccountsPayableList(): Promise<void> {
    this.setLoading(true);
    this.clearError();
    this.setAccountsPayableList([]);

    await lastValueFrom(
      this.service.getAll().pipe(
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
    console.log('Updated Accounts Payable List:', updatedList);

    this.updateState('accountsPayableList', updatedList);
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
}
