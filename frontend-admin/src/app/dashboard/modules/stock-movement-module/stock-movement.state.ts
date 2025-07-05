import { computed, inject, Injectable, signal } from '@angular/core';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import {
  StockMovement,
  StockMovementModuleState,
} from 'app/shared/interfaces/stock-movement.interface';
import { BaseState } from 'app/shared/store/base.state';
import { catchError, finalize, lastValueFrom } from 'rxjs';
import { environments } from 'src/environments/environments';
import { StockMovementService } from './stock-movement.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class StockMovementState extends BaseState<StockMovementModuleState> {
  private stockMovementService = inject(StockMovementService);
  private http = inject(HttpClient);
  private apiUrl = environments.apiUrl;

  protected state = signal<StockMovementModuleState>({
    stockMovementList: [],
    view:
      (localStorage.getItem(
        'stockMovementView'
      ) as StockMovementModuleState['view']) || 'table',
    loading: false,
    error: null,
  });

  stockMovementList = computed(() => this.state().stockMovementList);
  currentView = computed(() => this.state().view);

  async getStockMovementList(): Promise<void> {
    this.setLoading(true);
    this.clearError();
    this.setStockMovementList([]);

    await lastValueFrom(
      this.http
        .get<ApiResponse<StockMovement[]>>(`${this.apiUrl}stock-movement/all`, {
          headers: { 'Skip-Loader': 'true' },
        })
        .pipe(
          catchError(error => this.handleError(error)),
          finalize(() => this.setLoading(false))
        )
    )
      .then((response: any) => {
        const stockMovements = Array.isArray(response)
          ? response
          : response.dados;
        if (stockMovements && stockMovements.length > 0) {
          this.setStockMovementList(stockMovements);
        } else {
          this.setStockMovementList([]);
          this.setError('Nenhum movimento de estoque encontrado.');
        }
      })
      .catch(error => {
        this.setError('Erro ao carregar a lista de movimentos de estoque');
        console.error('Erro ao buscar movimentos de estoque:', error);
      });
  }

  async getStockMovementsByProduct(productId: string): Promise<void> {
    this.setLoading(true);
    this.clearError();

    await lastValueFrom(
      this.http
        .get<ApiResponse<StockMovement[]>>(
          `${this.apiUrl}stock-movement/product/${productId}`,
          {
            headers: { 'Skip-Loader': 'true' },
          }
        )
        .pipe(
          catchError(error => this.handleError(error)),
          finalize(() => this.setLoading(false))
        )
    )
      .then((response: any) => {
        const stockMovements = Array.isArray(response)
          ? response
          : response.dados;
        if (stockMovements && stockMovements.length > 0) {
          this.setStockMovementList(stockMovements);
        } else {
          this.setStockMovementList([]);
          this.setError(
            'Nenhum movimento de estoque encontrado para este produto.'
          );
        }
      })
      .catch(error => {
        this.setError('Erro ao carregar movimentos de estoque do produto');
        console.error(
          'Erro ao buscar movimentos de estoque do produto:',
          error
        );
      });
  }

  setStockMovementList(stockMovementList: StockMovement[]) {
    this.state.update(state => ({
      ...state,
      stockMovementList,
    }));
  }

  setView(view: StockMovementModuleState['view']) {
    this.state.update(state => ({
      ...state,
      view,
    }));
    localStorage.setItem('stockMovementView', view);
  }

  constructor() {
    super();
  }
}
