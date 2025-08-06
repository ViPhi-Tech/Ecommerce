import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, lastValueFrom, tap } from 'rxjs';
import { AccountsPayableService } from './accounts-payable.service';
import { BaseState } from 'app/shared/store/base.state';
import { AccountsPayableModuleState } from 'app/shared/interfaces/accounts-payable/AccountsPayableModuleState';
import { IAccountsPayable } from 'app/shared/interfaces/accounts-payable/AccountsPayable';

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
    list = list.map(item => ({
      ...item,
      supplierName: item.supplier?.tradeName || 'Fornecedor Desconhecido',
      ...this.convertStatus(item),
    }));

    this.updateState('accountsPayableList', list);
  }

  removeAccountPayable(id: number) {
    this.updateState('accountsPayableList', this.accountsPayableList().filter(item => item.id !== id));
  }

  updateAccountPayableStatus(id: number, status: string) {
    const updatedList = this.accountsPayableList().map(item => {
      if (item.id === id) {
        return { ...item, status };
      }
      return item;
    });
    this.updateState('accountsPayableList', updatedList);
  }

  convertStatus(item: IAccountsPayable) {
    const statusMap: Record<string, { status: string; statusBadgeColor: string }> = {
      'pending': {
        status: 'Pendente',
        statusBadgeColor: 'info',
      },
      'paid': {
        status: 'Pago',
        statusBadgeColor: 'success',
      },
      'overdue': {
        status: 'Vencido',
        statusBadgeColor: 'danger',
      },
      'cancelled': {
        status: 'Cancelado',
        statusBadgeColor: 'secondary',
      },
    };

    return statusMap[item.status] || { status: 'Desconhecido', statusBadgeColor: 'secondary' };
  }
}
