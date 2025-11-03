import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, tap } from 'rxjs';
import { lastValueFrom } from 'rxjs';
import { SupplierService } from 'app/dashboard/modules/supplier-module/supplier.service';
import { BaseState } from 'app/shared/store/base.state';
import { SupplierModuleState } from 'app/shared/interfaces/supplier/SupplierModuleState';

@Injectable({
  providedIn: 'root',
})
export class SupplierState extends BaseState<SupplierModuleState> {
  private supplierService = inject(SupplierService);

  protected state = signal<SupplierModuleState>({
    supplierList: [],
    loading: false,
    error: null,
  });

  // Cache control - indica se o cache é válido
  private cacheValid = signal<boolean>(false);

  supplierList = computed(() => this.state().supplierList);

  constructor() {
    super();
  }

  async getSupplierList(skipLoader = true, forceRefresh = false): Promise<void> {
    // Se o cache é válido e não está forçando refresh, retorna sem fazer requisição
    if (this.cacheValid() && !forceRefresh && this.state().supplierList.length > 0) {
      return;
    }

    this.setLoading(true);
    this.setError(null);

    // Só limpa a lista se estiver forçando refresh
    if (forceRefresh) {
      this.setSupplierList([]);
    }

    try {
      await lastValueFrom(
        this.supplierService.getSuppliers(skipLoader).pipe(
          tap(data => {
            this.setSupplierList(data.dados);
            this.cacheValid.set(true); // Marca o cache como válido após carregar
          }),
          catchError(error => {
            this.handleError(error, 'Erro ao carregar fornecedores');
            this.cacheValid.set(false); // Invalida o cache em caso de erro
            throw error;
          }),
          finalize(() => this.setLoading(false))
        )
      );
    } catch (error) {
      // Erro já foi tratado no catchError
      console.error('Erro na requisição de fornecedores:', error);
    }
  }

  setSupplierList(supplierList: any) {
    this.updateState('supplierList', supplierList);
  }

  /**
   * Invalida o cache da lista de fornecedores
   * Deve ser chamado após operações de criar, atualizar ou deletar
   */
  invalidateCache() {
    this.cacheValid.set(false);
  }
}
