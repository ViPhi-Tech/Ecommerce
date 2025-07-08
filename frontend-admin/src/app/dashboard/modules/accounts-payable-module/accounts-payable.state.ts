import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, lastValueFrom } from 'rxjs';
import { AccountsPayableService } from './accounts-payable.service';
import { BaseModuleState, BaseState } from 'app/shared/store/base.state';

export interface AccountsPayableModuleState extends BaseModuleState {
  accountsPayableList: any[];
}

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
      this.service.getAll()
        .pipe(
          catchError(() => this.handleError('Erro ao carregar a lista de contas a pagar')),
          finalize(() => this.setLoading(false))
        )
    )
      .then((response: any) => {
        const items = Array.isArray(response) ? response : response.dados;
        if (items && items.length > 0) {
          this.setAccountsPayableList(items);
        } else {
          this.setAccountsPayableList([]);
          this.setError('Nenhuma conta a pagar encontrada.');
        }
      })
      .catch(error => {
        this.setError('Erro ao carregar a lista de contas a pagar');
        console.error('Erro ao buscar contas a pagar:', error);
      });
  }

  setAccountsPayableList(list: any[]) {
    this.updateState('accountsPayableList', list);
  }

}
