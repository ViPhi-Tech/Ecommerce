import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize } from 'rxjs';
import { Delivery, DeliveryModuleState } from './interfaces/delivery.interface';
import { lastValueFrom } from 'rxjs';
import { DeliveryService } from './delivery.service';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { BaseState } from 'app/shared/store/base.state';

@Injectable({
  providedIn: 'root',
})
export class DeliveryState extends BaseState<DeliveryModuleState> {
  private deliveryService = inject(DeliveryService);

  protected state = signal<DeliveryModuleState>({
    deliveryList: [],
    deliveryDetails: {} as Delivery,
    loading: false,
    error: null,
  });

  deliveryList = computed(() => this.state().deliveryList);
  deliveryDetails = computed(() => this.state().deliveryDetails);

  getDeliveryList(skipLoader = true): void {
    this.setLoading(true);
    this.clearError();
    this.setDeliveryList([]);

    lastValueFrom(
      this.deliveryService.getDeliveries(skipLoader).pipe(
        catchError(error => this.handleError(error)),
        finalize(() => this.setLoading(false))
      )
    )
      .then((response: ApiResponse<Delivery[]>) => {
        const deliveries = Array.isArray(response)
          ? response
          : response?.data || response?.dados;
        if (deliveries && deliveries.length > 0) {
          this.setDeliveryList(deliveries);
        } else {
          this.setDeliveryList([]);
          this.setError('Nenhuma entrega encontrada.');
        }
      })
      .catch(error => {
        this.setError('Erro ao carregar a lista de entregas');
        console.error('Erro ao buscar entregas:', error);
      });
  }

  setDeliveryList(deliveryList: Delivery[]) {
    this.updateState('deliveryList', deliveryList);
  }

  getDeliveryById(deliveryId: string | number): Promise<Delivery> {
    this.setLoading(true);
    this.clearError();

    return lastValueFrom(
      this.deliveryService.getDeliveryById(deliveryId).pipe(
        catchError(error => this.handleError(error)),
        finalize(() => this.setLoading(false))
      )
    ).then((response: ApiResponse<Delivery>) => {
      this.updateState('deliveryDetails', response.data);
      return response.data;
    });
  }

  createDelivery(data: Partial<Delivery>): Promise<Delivery> {
    this.setLoading(true);
    this.clearError();

    return lastValueFrom(
      this.deliveryService.createDelivery(data).pipe(
        catchError(error => this.handleError(error)),
        finalize(() => this.setLoading(false))
      )
    ).then((response: ApiResponse<Delivery>) => {
      const newDelivery = response.data;
      const currentList = this.deliveryList();
      this.setDeliveryList([...currentList, newDelivery]);
      return newDelivery;
    });
  }

  updateDelivery(deliveryId: string | number, data: Partial<Delivery>): Promise<Delivery> {
    this.setLoading(true);
    this.clearError();

    return lastValueFrom(
      this.deliveryService.updateDelivery(deliveryId, data).pipe(
        catchError(error => this.handleError(error)),
        finalize(() => this.setLoading(false))
      )
    ).then((response: ApiResponse<Delivery>) => {
      const updatedDelivery = response.data;
      const currentList = this.deliveryList();
      const updatedList = currentList.map(delivery =>
        delivery.id === deliveryId ? updatedDelivery : delivery
      );
      this.setDeliveryList(updatedList);
      if (this.deliveryDetails().id === deliveryId) {
        this.updateState('deliveryDetails', updatedDelivery);
      }
      return updatedDelivery;
    });
  }

  deleteDelivery(deliveryId: string | number): Promise<void> {
    this.setLoading(true);
    this.clearError();

    return lastValueFrom(
      this.deliveryService.deleteDelivery(deliveryId).pipe(
        catchError(error => this.handleError(error)),
        finalize(() => this.setLoading(false))
      )
    ).then(() => {
      const currentList = this.deliveryList();
      const filteredList = currentList.filter(delivery => delivery.id !== deliveryId);
      this.setDeliveryList(filteredList);
      if (this.deliveryDetails().id === deliveryId) {
        this.updateState('deliveryDetails', {} as Delivery);
      }
    });
  }

  generateRoute(deliveryId: string | number): Promise<Delivery> {
    this.setLoading(true);
    this.clearError();

    return lastValueFrom(
      this.deliveryService.generateRoute(deliveryId).pipe(
        catchError(error => this.handleError(error)),
        finalize(() => this.setLoading(false))
      )
    ).then(() => {
      return this.getDeliveryById(deliveryId);
    });
  }

  optimizeRoute(deliveryId: string | number): Promise<Delivery> {
    this.setLoading(true);
    this.clearError();

    return lastValueFrom(
      this.deliveryService.optimizeRoute(deliveryId).pipe(
        catchError(error => this.handleError(error)),
        finalize(() => this.setLoading(false))
      )
    ).then(() => {
      return this.getDeliveryById(deliveryId);
    });
  }

  resetDelivery() {
    this.updateState('deliveryDetails', {} as Delivery);
  }
}

