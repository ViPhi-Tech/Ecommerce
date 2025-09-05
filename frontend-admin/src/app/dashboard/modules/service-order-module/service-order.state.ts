import { computed, inject, Injectable, signal } from '@angular/core';
import { BaseState } from 'app/shared/store/base.state';
import { catchError, finalize, lastValueFrom, tap } from 'rxjs';
import { ServiceOrderService } from './service-order.service';
import { ServiceOrderModuleState } from 'app/shared/interfaces/service-order/ServiceOrderModuleState';
import { IServiceOrder } from 'app/shared/interfaces/service-order/ServiceOrder';

@Injectable({
  providedIn: 'root',
})
export class ServiceOrderState extends BaseState<ServiceOrderModuleState> {
  private serviceOrderService = inject(ServiceOrderService);

  protected state = signal<ServiceOrderModuleState>({
    serviceOrderList: [],
    view:
      (localStorage.getItem('serviceOrderView') as ServiceOrderModuleState['view']) ||
      'list',
    loading: false,
    error: null,
    orderFilter: '',
    searchTerm: '',
    filteredServiceOrders: [],
  });

  serviceOrderList = computed(() => this.state().serviceOrderList);
  currentView = computed(() => this.state().view);
  currentOrderFilter = computed(() => this.state().orderFilter);
  currentSearchTerm = computed(() => this.state().searchTerm);

  filteredServiceOrders = computed(() => {
    const state = this.state();
    const filter = state.orderFilter;
    const searchTerm = state.searchTerm;
    let filteredServiceOrders = [...state.filteredServiceOrders];

    filteredServiceOrders.sort((a, b) => {
      if (filter === 'low-priority') {
        return a.priority.localeCompare(b.priority);
      } else if (filter === 'high-priority') {
        return b.priority.localeCompare(a.priority);
      } else if (filter === 'az') {
        return a.client.localeCompare(b.client);
      } else if (filter === 'za') {
        return b.client.localeCompare(a.client);
      }
      return 0;
    });

    if (searchTerm.trim()) {
      filteredServiceOrders = filteredServiceOrders.filter(serviceOrder =>
        serviceOrder.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        serviceOrder.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredServiceOrders;
  });

  async getServiceOrderList(skipLoader = true): Promise<void> {
    this.setLoading(true);
    this.clearError();
    this.setServiceOrderList([]);

    await lastValueFrom(
      this.serviceOrderService.getAll(skipLoader).pipe(
        tap((response: any) => {
          const serviceOrders = Array.isArray(response) ? response : response.dados;
          if (serviceOrders && serviceOrders.length > 0) {
            this.setServiceOrderList(serviceOrders);
          } else {
            this.setServiceOrderList([]);
            this.setError('Nenhuma ordem de serviço encontrada.');
          }
        }),
        catchError(error => this.handleError(error)),
        finalize(() => this.setLoading(false))
      )
    );
  }

  searchServiceOrders(query: string): void {
    this.setLoading(true);
    this.clearError();

    this.serviceOrderService
      .filterServiceOrders(query)
      .pipe(
        tap((response: any) => {
          const serviceOrders = Array.isArray(response) ? response : response.dados;
          if (serviceOrders && serviceOrders.length > 0) {
            this.setFilteredServiceOrders(serviceOrders);
          } else {
            this.setFilteredServiceOrders([]);
            this.setError('Nenhuma ordem de serviço encontrada.');
          }
        }),
        catchError(error => this.handleError(error)),
        finalize(() => this.setLoading(false))
      )
      .subscribe();
  }

  setServiceOrderList(serviceOrderList: IServiceOrder[]) {
    this.updateState('serviceOrderList', serviceOrderList);
  }

  setFilteredServiceOrders(filteredServiceOrders: IServiceOrder[]) {
    this.updateState('filteredServiceOrders', filteredServiceOrders);
  }

  setView(view: ServiceOrderModuleState['view']) {
    this.updateState('view', view);
    localStorage.setItem('serviceOrderView', view);
  }

  setOrderFilter(filter: string) {
    this.updateState('orderFilter', filter);
  }

  setSearchTerm(searchTerm: string) {
    this.updateState('searchTerm', searchTerm);
  }

  clearState() {
    this.state.set({
      serviceOrderList: [],
      view: 'list',
      loading: false,
      error: null,
      orderFilter: '',
      searchTerm: '',
      filteredServiceOrders: [],
    });
  }

  constructor() {
    super();
  }
}
