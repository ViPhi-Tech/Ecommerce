import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, lastValueFrom } from 'rxjs';
import { environments } from 'src/environments/environments';
import { HttpClient } from '@angular/common/http';
import { AccountsReceivableService } from './accounts-receivable.service';

export interface AccountsReceivableModuleState {
  accountsReceivableList: any[];
  view: 'table' | 'list';
  loading?: boolean;
  error?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AccountsReceivableState {
  private service = inject(AccountsReceivableService);

  protected state = signal<AccountsReceivableModuleState>({
    accountsReceivableList: [],
    view: (localStorage.getItem('accountsReceivableView') as AccountsReceivableModuleState['view']) || 'table',
    loading: false,
    error: null,
  });

  accountsReceivableList = computed(() => this.state().accountsReceivableList);
  currentView = computed(() => this.state().view);
  loading = computed(() => this.state().loading);

  async getAccountsReceivableList(): Promise<void> {
    this.setLoading(true);
    this.clearError();
    this.setAccountsReceivableList([]);

    await lastValueFrom(
      this.service.getAll()
        .pipe(
          catchError(() => this.handleError()),
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

  setLoading(loading: boolean) {
    this.updateState('loading', loading);
  }

  setError(error: string | null) {
    this.updateState('error', error);
  }

  clearError() {
    this.setError(null);
  }

  updateState<K extends keyof AccountsReceivableModuleState>(key: K, value: AccountsReceivableModuleState[K]) {
    this.state.update((s) => ({ ...s, [key]: value }));
  }

  constructor() {}

  private handleError() {
    this.setError('Erro ao buscar dados');
    return [];
  }
}
