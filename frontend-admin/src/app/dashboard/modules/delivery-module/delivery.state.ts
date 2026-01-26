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
    ).then((response: any) => {
      // O backend pode retornar response.data ou response.dados
      const delivery = response?.data || response?.dados || response;
      console.log('Response completa:', response);
      console.log('Delivery extraído:', delivery);
      this.updateState('deliveryDetails', delivery);
      return delivery;
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

  updateDelivery(
    deliveryId: string | number,
    data: Partial<Delivery>
  ): Promise<Delivery> {
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
      const filteredList = currentList.filter(
        delivery => delivery.id !== deliveryId
      );
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

  cancelDelivery(uuid: string): Promise<Delivery> {
    console.log('DeliveryState.cancelDelivery - UUID recebido:', uuid);
    console.log('DeliveryState.cancelDelivery - Tipo:', typeof uuid);
    console.log('DeliveryState.cancelDelivery - É UUID válido?', /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid));
    
    this.setLoading(true);
    this.clearError();

    return lastValueFrom(
      this.deliveryService.cancelDelivery(uuid).pipe(
        catchError(error => {
          console.error('DeliveryState.cancelDelivery - Erro:', error);
          return this.handleError(error);
        }),
        finalize(() => this.setLoading(false))
      )
    ).then((response: ApiResponse<Delivery>) => {
      const cancelledDelivery = response?.data || response?.dados || response;
      const currentList = this.deliveryList();
      const updatedList = currentList.map(delivery =>
        delivery.uuid === uuid ? cancelledDelivery : delivery
      );
      this.setDeliveryList(updatedList);
      if (this.deliveryDetails().uuid === uuid) {
        this.updateState('deliveryDetails', cancelledDelivery);
      }
      return cancelledDelivery;
    });
  }

  resetDelivery() {
    this.updateState('deliveryDetails', {} as Delivery);
  }
}
