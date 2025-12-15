import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, tap } from 'rxjs';
import { lastValueFrom } from 'rxjs';
import { ClientService } from 'app/dashboard/modules/client-module/client.service';
import { BaseState } from 'app/shared/store/base.state';
import { ClientModuleState } from 'app/shared/interfaces/client/ClientModuleState';
import { IClient } from 'app/shared/interfaces/client/Client';

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

  // Cache control - indica se o cache é válido
  private cacheValid = signal<boolean>(false);

  clientList = computed(() => this.state().clientList);
  searchTerm = computed(() => this.state().searchTerm);

  constructor() {
    super();
    // Se inscreve no refresh$ do ClientService para invalidar o cache quando necessário
    // Como é um serviço singleton (providedIn: 'root'), não precisa de takeUntil
    this.clientService.refresh$.subscribe(() => {
      this.invalidateCache();
    });
  }

  async getClientList(skipLoader = true, forceRefresh = false): Promise<void> {
    // Se o cache é válido e não está forçando refresh, retorna sem fazer requisição
    if (this.cacheValid() && !forceRefresh && this.state().clientList.length > 0) {
      return;
    }

    this.setLoading(true);
    this.setError(null);

    // Só limpa a lista se estiver forçando refresh
    if (forceRefresh) {
      this.setClientList([]);
    }

    try {
      await lastValueFrom(
        this.clientService.getClients(skipLoader).pipe(
          tap(data => {
            this.setClientList(data.dados);
            this.cacheValid.set(true); // Marca o cache como válido após carregar
          }),
          catchError(error => {
            this.handleError(error, 'Erro ao carregar clientes');
            this.cacheValid.set(false); // Invalida o cache em caso de erro
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
      (client: IClient) =>
        client.fullName?.toLowerCase().includes(search) ||
        client.document?.toLowerCase().includes(search) ||
        client.phone?.toLowerCase().includes(search) ||
        client.email?.toLowerCase().includes(search)
    );
  });

  setSearchTerm(term: string) {
    this.updateState('searchTerm', term);
  }

  /**
   * Invalida o cache da lista de clientes
   * Deve ser chamado após operações de criar, atualizar ou deletar
   */
  invalidateCache() {
    this.cacheValid.set(false);
  }
}
