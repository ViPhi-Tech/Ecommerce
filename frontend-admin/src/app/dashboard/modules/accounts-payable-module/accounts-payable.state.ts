import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, lastValueFrom, tap } from 'rxjs';
import { AccountsPayableService } from './accounts-payable.service';
import { BaseState } from 'app/shared/store/base.state';
import { AccountsPayableModuleState } from 'app/shared/interfaces/accounts-payable/AccountsPayableModuleState';

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
        tap(data => this.setAccountsPayableList(data.dados)),
        catchError(() =>
          this.handleError('Erro ao carregar a lista de contas a pagar')
        ),
        finalize(() => this.setLoading(false))
      )
    );
  }

  setAccountsPayableList(list: any[]) {
    this.updateState('accountsPayableList', list);
  }
}
