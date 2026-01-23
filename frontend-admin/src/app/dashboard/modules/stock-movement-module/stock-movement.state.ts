import { computed, inject, Injectable, signal } from '@angular/core';
import { BaseState } from 'app/shared/store/base.state';
import { catchError, finalize, lastValueFrom, of, tap } from 'rxjs';
import { environments } from 'src/environments/environments';
import { StockMovementService } from './stock-movement.service';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { MetricDTO } from './dtos/MetricDTO';
import dayjs from 'dayjs';
import { StockMovementModuleState } from 'app/shared/interfaces/stock/StockMovementModuleState';
import { IMovimentItem } from 'app/shared/interfaces/stock/IMovimentItem';
import { ButtonSeverityType } from 'app/shared/types/button.types';

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

  stockMovementList = computed(() => {
    let list = [...this.state().stockMovementList];

    // Agrupar movimentações por produto
    const movementsByProduct = new Map<number, IMovimentItem[]>();
    list.forEach(item => {
      const productIdRaw = item.stock?.product?.id;
      // Garantir que productId seja sempre um número
      const productId =
        typeof productIdRaw === 'string'
          ? parseInt(productIdRaw, 10)
          : productIdRaw;
      if (productId && !isNaN(productId)) {
        if (!movementsByProduct.has(productId)) {
          movementsByProduct.set(productId, []);
        }
        movementsByProduct.get(productId)!.push(item);
      }
    });

    // Para cada produto, calcular estoque antes e depois de cada movimentação
    movementsByProduct.forEach((movements, productId) => {
      // Ordenar por data (mais recente primeiro) - como vem do backend
      const sortedMovements = [...movements].sort((a, b) => {
        const dateA =
          typeof a.createdAt === 'string' ? new Date(a.createdAt) : a.createdAt;
        const dateB =
          typeof b.createdAt === 'string' ? new Date(b.createdAt) : b.createdAt;
        return dateB.getTime() - dateA.getTime(); // Mais recente primeiro
      });

      // Pegar o estoque atual (do primeiro item, que é o mais recente)
      const currentStock = sortedMovements[0]?.stock?.quantity ?? 0;
      let runningStock = currentStock;

      // Processar do mais recente para o mais antigo, revertendo as movimentações
      sortedMovements.forEach(item => {
        const quantity = item.quantity || 0;

        // O estoque após esta movimentação é o runningStock atual
        const stockAfter = runningStock;

        // Calcular estoque antes revertendo a movimentação
        let stockBefore: number;
        if (item.type === 'IN') {
          stockBefore = Math.max(0, runningStock - quantity);
        } else if (item.type === 'OUT') {
          stockBefore = runningStock + quantity;
        } else {
          stockBefore = runningStock;
        }

        // Atualizar runningStock para a próxima movimentação (mais antiga)
        runningStock = stockBefore;

        // Adicionar informações de estoque ao item original na lista
        const originalItem = list.find(l => l.id === item.id);
        if (originalItem) {
          (originalItem as any).previousStock = stockBefore;
          (originalItem as any).currentStockAfterMovement = stockAfter;
        }
      });
    });

    // Formatar os dados
    list = list.map(item => {
      // Converter createdAt para Date se for string
      const createdAtDate =
        typeof item.createdAt === 'string'
          ? new Date(item.createdAt)
          : item.createdAt;

      item.date = dayjs(createdAtDate).format('DD/MM/YYYY');
      item.hour = dayjs(createdAtDate).format('HH:mm');

      // Converter datas do purchaseInvoice se existir
      if (item.purchaseInvoice) {
        if (typeof item.purchaseInvoice.issueDate === 'string') {
          item.purchaseInvoice.issueDate = new Date(
            item.purchaseInvoice.issueDate
          );
        }
        if (typeof item.purchaseInvoice.entryDate === 'string') {
          item.purchaseInvoice.entryDate = new Date(
            item.purchaseInvoice.entryDate
          );
        }
      }

      item = this.formatStockMovementData(item);

      return item as IMovimentItem;
    });

    return list;
  });
  cardsData = computed(() => this.state().cardsData);
  loadingCards = computed(() => this.state().loadingCards);

  constructor() {
    super();
  }

  async getStockMovementList(
    filter: MetricDTO,
    skipLoader = true
  ): Promise<void> {
    this.setLoading(true);
    this.clearError();
    this.setStockMovementList([]);

    await lastValueFrom(
      this.stockMovementService.getAll(filter, skipLoader).pipe(
        tap(data => this.setStockMovementList(data?.dados || [])),
        catchError(error => this.handleError(error)),
        finalize(() => this.setLoading(false))
      )
    );
  }

  async getStockMetrics(skipLoader = true): Promise<void> {
    this.setLoadingCards(true);
    this.clearError();
    await lastValueFrom(
      this.stockMovementService.getStockMetrics(skipLoader).pipe(
        tap(data => this.updateState('cardsData', data?.dados || null)),
        catchError(error => {
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

  formatStockMovementData(item: IMovimentItem) {
    // Converter createdAt para Date se for string
    const createdAtDate =
      typeof item.createdAt === 'string'
        ? new Date(item.createdAt)
        : item.createdAt;

    item.date = `${dayjs(createdAtDate).format('DD/MM/YYYY')} ${dayjs(createdAtDate).format('HH:mm')}`;

    // Usar product diretamente se disponível, senão usar stock.product
    item.productName = item.product?.name || item.stock?.product?.name || '';
    item.productSku = item.product?.sku || item.stock?.product?.sku || '';
    item.typeBadge = this.getMovementTypeBadge(item.type);
    item.typeLabel = this.getMovementTypeLabel(item.type);

    return item;
  }

  getMovementTypeLabel(type: string): string {
    switch (type) {
      case 'IN':
        return 'Entrada';
      case 'OUT':
        return 'Saída';
      case 'ADJUSTMENT':
        return 'Ajuste';
      default:
        return type;
    }
  }
  getMovementTypeBadge(type: string): ButtonSeverityType {
    switch (type) {
      case 'IN':
        return 'success';
      case 'OUT':
        return 'danger';
      case 'ADJUSTMENT':
        return 'warn';
      default:
        return 'info';
    }
  }

  setLoadingCards(loading: boolean) {
    this.updateState('loadingCards', loading);
  }

  setStockMovementList(stockMovementList: IMovimentItem[]) {
    this.updateState('stockMovementList', stockMovementList);
  }
}
