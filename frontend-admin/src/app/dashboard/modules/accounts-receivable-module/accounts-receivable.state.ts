import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, lastValueFrom, Subject, tap } from 'rxjs';
import { AccountsReceivableService } from './accounts-receivable.service';
import { BaseState } from 'app/shared/store/base.state';
import { AccountsReceivableModuleState } from 'app/shared/interfaces/accounts-receivable/AccountsReceivableModuleState';
import { IAccountsReceivable } from 'app/shared/interfaces/accounts-receivable/AccountsReceivable';
import { AccountsReceivableStatus } from 'app/shared/interfaces/accounts-receivable/AccountsReceivableStatus';

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

  // Subject para pré-preencher o formulário de contas a receber
  private formPrefillSubject = new Subject<Partial<IAccountsReceivable>>();
  formPrefill$ = this.formPrefillSubject.asObservable();

  async getAccountsReceivableList(skipLoader = true): Promise<void> {
    this.setLoading(true);
    this.clearError();
    this.setAccountsReceivableList([]);

    await lastValueFrom(
      this.service.getAll(skipLoader).pipe(
        tap(data => this.setAccountsReceivableList(data.data)),
        catchError(() => {
          return this.handleError(
            'Erro ao carregar a lista de contas a receber'
          );
        }),
        finalize(() => this.setLoading(false))
      )
    );
  }

  setAccountsReceivableList(list: IAccountsReceivable[]) {
    list = list.map(item => {
      item.status = this.determineAccountStatus(item);
      return {
        ...item,
        clientName: item.client?.fullName || 'Cliente Desconhecido',
        ...this.convertStatus(item),
      };
    });

    this.updateState('accountsReceivableList', list);
  }

  removeAccountReceivable(id: number) {
    this.updateState(
      'accountsReceivableList',
      this.accountsReceivableList().filter(item => item.id !== id)
    );
  }

  updateAccountReceivableStatus(id: number, status: AccountsReceivableStatus) {
    const updatedList = this.accountsReceivableList().map(item => {
      if (item.id === id) {
        return { ...item, status };
      }
      return item;
    });
    this.setAccountsReceivableList(updatedList);

    lastValueFrom(
      this.service.updateAccountReceivableStatus(id, status).pipe(
        catchError(() => {
          this.handleError('Erro ao atualizar status da conta a receber');
          return [];
        })
      )
    );
  }

  private determineAccountStatus(
    account: IAccountsReceivable
  ): AccountsReceivableStatus {
    const now = new Date();
    const dueDate = new Date(account.dueDate);
    const daysDifference = Math.ceil(
      (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (account.status === 'received') {
      return 'received';
    }

    if (daysDifference < 0) {
      return 'overdue';
    }

    if (daysDifference <= 7) {
      return 'due_soon';
    }

    return 'pending';
  }

  convertStatus(item: IAccountsReceivable) {
    switch (item.status) {
      case 'pending':
        return { statusLabel: 'Pendente', statusBadgeColor: 'info' };
      case 'received':
        return { statusLabel: 'Recebido', statusBadgeColor: 'success' };
      case 'overdue':
        return { statusLabel: 'Vencido', statusBadgeColor: 'danger' };
      case 'due_soon':
        return { statusLabel: 'Vence em Breve', statusBadgeColor: 'warn' };
      default:
        return { statusLabel: 'Desconhecido', statusBadgeColor: 'secondary' };
    }
  }

  /**
   * Emite dados para pré-preencher o formulário de contas a receber
   * @param data Dados parciais para preencher o formulário
   */
  prefillForm(data: Partial<IAccountsReceivable>): void {
    this.formPrefillSubject.next(data);
  }

  /**
   * Limpa os dados de pré-preenchimento
   */
  clearFormPrefill(): void {
    this.formPrefillSubject.next({});
  }
}
