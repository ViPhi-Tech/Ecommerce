import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, lastValueFrom, tap } from 'rxjs';
import { AccountsReceivableService } from './accounts-receivable.service';
import { BaseState } from 'app/shared/store/base.state';
import { AccountsReceivableModuleState } from 'app/shared/interfaces/accounts-receivable/AccountsReceivableModuleState';

@Injectable({
  providedIn: 'root',
})
export class AccountsReceivableState extends BaseState<AccountsReceivableModuleState> {
  private service = inject(AccountsReceivableService);

  protected state = signal<AccountsReceivableModuleState>({
    accountsReceivableList: [],
    loading: false,
    error: null,
  });

  accountsReceivableList = computed(() => this.state().accountsReceivableList);

  async getAccountsReceivableList(): Promise<void> {
    this.setLoading(true);
    this.clearError();
    this.setAccountsReceivableList([]);

    await lastValueFrom(
      this.service.getAll().pipe(
        tap(data => this.setAccountsReceivableList(data.dados)),
        catchError(() =>
          this.handleError('Erro ao carregar a lista de contas a receber')
        ),
        finalize(() => this.setLoading(false))
      )
    );
  }

  setAccountsReceivableList(list: any[]) {
    this.updateState('accountsReceivableList', list);
  }

  removeAccountReceivable(id: number) {
    this.updateState('accountsReceivableList', this.accountsReceivableList().filter(item => item.id !== id));
  }
}
