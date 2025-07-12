import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, tap } from 'rxjs';
import { lastValueFrom } from 'rxjs';
import { ClientService } from 'app/dashboard/modules/client-module/client.service';
import { BaseState } from 'app/shared/store/base.state';
import { ClientModuleState } from './client.interface';

@Injectable({
  providedIn: 'root',
})
export class ClientState extends BaseState<ClientModuleState> {
  private clientService = inject(ClientService);

  protected state = signal<ClientModuleState>({
    clientList: [],
    loading: false,
    searchTerm: '', // Adicionando campo de busca
    error: null,
  });

  clientList = computed(() => this.state().clientList);
  searchTerm = computed(() => this.state().searchTerm);

  constructor() {
    super();
  }

  async getClientList(): Promise<void> {
    this.setLoading(true);
    this.setError(null);
    this.setClientList([]);

    try {
      await lastValueFrom(
        this.clientService.getClients().pipe(
          tap(data => this.setClientList(data.dados)),
          catchError(error => {
            this.handleError(error, 'Erro ao carregar clientes');
            throw error;
          }),
          finalize(() => this.setLoading(false))
        )
      );
    } catch (error) {
      // Erro já foi tratado no catchError
      console.error('Erro na requisição de clientes:', error);
    }
  }

  setClientList(clientList: any) {
    this.updateState('clientList', clientList);
  }

  clientFil = computed(() => {
    const clients = this.state().clientList;
    const search = this.state().searchTerm.toLowerCase().trim();

    if (!search) {
      return clients;
    }

    return clients.filter(
      client =>
        client.fullName?.toLowerCase().includes(search) ||
        client.document?.toLowerCase().includes(search) ||
        client.phone?.toLowerCase().includes(search) ||
        client.email?.toLowerCase().includes(search)
    );
  });

  setSearchTerm(term: string) {
    this.updateState('searchTerm', term);
  }
}
