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

  supplierList = computed(() => this.state().supplierList);

  constructor() {
    super();
  }

  async getSupplierList(): Promise<void> {
    this.setLoading(true);
    this.setError(null);
    this.setSupplierList([]);

    try {
      await lastValueFrom(
        this.supplierService.getSuppliers().pipe(
          tap(data => this.setSupplierList(data.dados)),
          catchError(error => {
            this.handleError(error, 'Erro ao carregar fornecedores');
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
}
