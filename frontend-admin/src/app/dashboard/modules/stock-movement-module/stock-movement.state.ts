import { computed, inject, Injectable, signal } from '@angular/core';
import {
  StockMovement,
  StockMovementModuleState,
} from 'app/shared/interfaces/stock-movement.interface';
import { BaseState } from 'app/shared/store/base.state';
import { catchError, finalize, lastValueFrom, of, tap } from 'rxjs';
import { environments } from 'src/environments/environments';
import { StockMovementService } from './stock-movement.service';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { MetricDTO } from './dtos/MetricDTO';

@Injectable({
  providedIn: 'root',
})
export class StockMovementState extends BaseState<StockMovementModuleState> {
  private http = inject(HttpClient);
  private toast = inject(MessageService);
  private stockMovementService = inject(StockMovementService);
  private apiUrl = environments.apiUrl;

  protected state = signal<StockMovementModuleState>({
    stockMovementList: [],
    loading: false,
    loadingCards: true,
    cardsData: {
      totalStock: 0,
      monthIn: 0,
      monthOut: 0,
    },
    error: null,
  });

  stockMovementList = computed(() => this.state().stockMovementList);
  cardsData = computed(() => this.state().cardsData);
  loadingCards = computed(() => this.state().loadingCards);

  constructor() {
    super();
  }

  async getStockMovementList(filter: MetricDTO): Promise<void> {
    this.setLoading(true);
    this.clearError();
    this.setStockMovementList([]);

    await lastValueFrom(
      this.stockMovementService.getAll(filter, true).pipe(
        tap(data => this.setStockMovementList(data?.dados || [])),
        catchError(error => this.handleError(error)),
        finalize(() => this.setLoading(false))
      )
    );
  }

  async getStockMetrics(): Promise<void> {
    this.setLoadingCards(true);
    this.clearError();
    await lastValueFrom(
      this.stockMovementService.getStockMetrics().pipe(
        tap(data => this.updateState('cardsData', data?.dados || null)),
        catchError((error) => {
          this.handleError(error, 'Erro ao carregar métricas de estoque');
          this.toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar métricas de estoque',
          });
          return of(null);
        }),
        finalize(() => this.setLoadingCards(false))
      )
    );
  }

  setLoadingCards(loading: boolean) {
    this.updateState('loadingCards', loading);
  }

  setStockMovementList(stockMovementList: StockMovement[]) {
    this.updateState('stockMovementList', stockMovementList);
  }

}
