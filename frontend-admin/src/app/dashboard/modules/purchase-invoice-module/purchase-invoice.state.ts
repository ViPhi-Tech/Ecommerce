import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, tap } from 'rxjs';
import { lastValueFrom } from 'rxjs';
import { PurchaseInvoiceService, PurchaseInvoice } from './purchase-invoice.service';
import { BaseState } from 'app/shared/store/base.state';

interface PurchaseInvoiceModuleState {
  purchaseInvoiceList: PurchaseInvoice[];
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class PurchaseInvoiceState extends BaseState<PurchaseInvoiceModuleState> {
  private purchaseInvoiceService = inject(PurchaseInvoiceService);

  protected state = signal<PurchaseInvoiceModuleState>({
    purchaseInvoiceList: [],
    loading: false,
    error: null,
  });

  // Cache control - indica se o cache é válido
  private cacheValid = signal<boolean>(false);

  purchaseInvoiceList = computed(() => this.state().purchaseInvoiceList);
  override loading = computed(() => this.state().loading);
  override error = computed(() => this.state().error);

  constructor() {
    super();
  }

  async getPurchaseInvoiceList(
    skipLoader = true,
    forceRefresh = false
  ): Promise<void> {
    // Se o cache é válido e não está forçando refresh, retorna sem fazer requisição
    if (
      this.cacheValid() &&
      !forceRefresh &&
      this.state().purchaseInvoiceList.length > 0
    ) {
      return;
    }

    this.setLoading(true);
    this.setError(null);

    // Só limpa a lista se estiver forçando refresh
    if (forceRefresh) {
      this.setPurchaseInvoiceList([]);
    }

    try {
      await lastValueFrom(
        this.purchaseInvoiceService.getAllPurchaseInvoices(skipLoader).pipe(
          tap(data => {
            // O backend retorna dados em 'dados' ou 'data'
            const invoices = data.dados || data.data || [];
            this.setPurchaseInvoiceList(Array.isArray(invoices) ? invoices : []);
            this.cacheValid.set(true); // Marca o cache como válido após carregar
          }),
          catchError(error => {
            console.error('Erro ao carregar notas fiscais:', error);
            this.handleError(error, 'Erro ao carregar notas fiscais');
            this.cacheValid.set(false); // Invalida o cache em caso de erro
            this.setPurchaseInvoiceList([]); // Limpa a lista em caso de erro
            throw error;
          }),
          finalize(() => {
            this.setLoading(false);
          })
        )
      );
    } catch (error) {
      // Erro já foi tratado no catchError
      this.setLoading(false);
      console.error('Erro na requisição de notas fiscais:', error);
    }
  }

  setPurchaseInvoiceList(purchaseInvoiceList: PurchaseInvoice[]) {
    this.updateState('purchaseInvoiceList', purchaseInvoiceList);
  }

  /**
   * Invalida o cache da lista de notas fiscais
   */
  invalidateCache() {
    this.cacheValid.set(false);
  }
}
