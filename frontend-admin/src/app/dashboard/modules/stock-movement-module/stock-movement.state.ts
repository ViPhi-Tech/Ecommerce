import { computed, inject, Injectable, signal } from '@angular/core';
import {
  StockMovement,
  StockMovementModuleState,
} from 'app/shared/interfaces/stock-movement.interface';
import { BaseState } from 'app/shared/store/base.state';
import { catchError, finalize, lastValueFrom, tap } from 'rxjs';
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
    stockMovementDetails: null,
    loading: false,
    error: null,
  });

  stockMovementList = computed(() => this.state().stockMovementList);

  constructor() {
    super();
  }

  async getStockMovementList(filter: any): Promise<void> {
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

  async getStockMovementsByProduct(productId: string): Promise<void> {
    this.setLoading(true);
    this.clearError();

    await lastValueFrom(
      this.stockMovementService.getStockMovementsByProduct(productId).pipe(
        tap(data => this.setStockMovementDetails(data?.dados || null)),
        catchError(error => this.handleError(error)),
        finalize(() => this.setLoading(false))
      )
    );
  }

  setStockMovementList(stockMovementList: StockMovement[]) {
    this.updateState('stockMovementList', stockMovementList);
  }

  setStockMovementDetails(stockMovement: StockMovement | null) {
    this.updateState('stockMovementDetails', stockMovement);
  }
}
