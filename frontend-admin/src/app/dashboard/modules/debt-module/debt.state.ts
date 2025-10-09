import { computed, inject, Injectable, signal } from '@angular/core';
import { BaseState } from 'app/shared/store/base.state';
import { catchError, finalize, lastValueFrom, tap } from 'rxjs';
import { DebtService } from './debt.service';
import { DebtModuleState } from 'app/shared/interfaces/debt/DebtModuleState';
import { IDebt } from 'app/shared/interfaces/debt/Debt';

@Injectable({
  providedIn: 'root',
})
export class DebtState extends BaseState<DebtModuleState> {
  private debtService = inject(DebtService);

  protected state = signal<DebtModuleState>({
    debtList: [],
    loading: false,
    error: null,
  });

  debtList = computed(() => this.state().debtList);

  async getDebtList(skipLoader = true): Promise<void> {
    this.setLoading(true);
    this.clearError();
    this.setDebtList([]);

    await lastValueFrom(
      this.debtService.getAll(skipLoader).pipe(
        tap((response: any) => {
          const debts = Array.isArray(response) ? response : response.data;
          if (debts && debts.length > 0) {
            this.setDebtList(debts);
          } else {
            this.setDebtList([]);
            this.setError('Nenhuma dívida encontrada.');
          }
        }),
        catchError(error => this.handleError(error)),
        finalize(() => this.setLoading(false))
      )
    );
  }

  setDebtList(debtList: IDebt[]) {
    this.updateState('debtList', debtList);
  }

  clearState() {
    this.state.set({
      debtList: [],
      loading: false,
      error: null,
    });
  }

  constructor() {
    super();
  }
}
