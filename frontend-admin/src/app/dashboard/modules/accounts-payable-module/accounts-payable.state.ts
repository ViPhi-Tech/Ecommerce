import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, lastValueFrom } from 'rxjs';
import { environments } from 'src/environments/environments';
import { HttpClient } from '@angular/common/http';
import { AccountsPayableService } from './accounts-payable.service';

export interface AccountsPayableModuleState {
  accountsPayableList: any[];
  view: 'table' | 'list';
  loading?: boolean;
  error?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AccountsPayableState {
  private http = inject(HttpClient);
  private apiUrl = environments.apiUrl;
  private service = inject(AccountsPayableService);

  protected state = signal<AccountsPayableModuleState>({
    accountsPayableList: [],
    view: (localStorage.getItem('accountsPayableView') as AccountsPayableModuleState['view']) || 'table',
    loading: false,
    error: null,
  });

  accountsPayableList = computed(() => this.state().accountsPayableList);
  currentView = computed(() => this.state().view);
  loading = computed(() => this.state().loading);

  async getAccountsPayableList(): Promise<void> {
    this.setLoading(true);
    this.clearError();
    this.setAccountsPayableList([]);

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

  setLoading(loading: boolean) {
    this.updateState('loading', loading);
  }

  setError(error: string | null) {
    this.updateState('error', error);
  }

  clearError() {
    this.setError(null);
  }

  updateState<K extends keyof AccountsPayableModuleState>(key: K, value: AccountsPayableModuleState[K]) {
    this.state.update((s) => ({ ...s, [key]: value }));
  }

  constructor() {}

  private handleError() {
    this.setError('Erro ao buscar dados');
    return [];
  }
}
