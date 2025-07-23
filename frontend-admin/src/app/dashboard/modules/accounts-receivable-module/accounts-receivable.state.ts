import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, lastValueFrom } from 'rxjs';
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
        catchError(() =>
          this.handleError('Erro ao carregar a lista de contas a pagar')
        ),
        finalize(() => this.setLoading(false))
      )
    )
      .then((response: any) => {
        const items = Array.isArray(response) ? response : response.dados;
        if (items && items.length > 0) {
          this.setAccountsReceivableList(items);
        } else {
          this.setAccountsReceivableList([]);
          this.setError('Nenhuma conta a pagar encontrada.');
        }
      })
      .catch(error => {
        this.setError('Erro ao carregar a lista de contas a pagar');
        console.error('Erro ao buscar contas a pagar:', error);
      });
  }

  setAccountsReceivableList(list: any[]) {
    this.updateState('accountsReceivableList', list);
  }
}
