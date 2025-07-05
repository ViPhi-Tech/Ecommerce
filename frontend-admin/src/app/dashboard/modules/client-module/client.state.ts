import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import {
  Client,
  ClientModuleState,
} from 'app/shared/interfaces/client-module.interface';
import { catchError, finalize, Observable, of, tap } from 'rxjs';
import { environments } from 'src/environments/environments';
import { lastValueFrom } from 'rxjs';
import { ClientService } from './client.service';

@Injectable({
  providedIn: 'root',
})
export class ClientState {
  private http = inject(HttpClient);
  private apiUrl = environments.apiUrl;

  private clientService = inject(ClientService);

  private state = signal<ClientModuleState>({
    clientList: [],
    view:
      (localStorage.getItem('clientView') as ClientModuleState['view']) ||
      'table',
    loading: false,
    error: null,
    searchTerm: '', // Adicionando campo de busca
  });

  clientList = computed(() => this.state().clientList);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);
  currentView = computed(() => this.state().view);
  searchTerm = computed(() => this.state().searchTerm);

  // Computed para filtrar clientes baseado no termo de busca
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

  async getClientList(options: { skipLoader?: boolean }): Promise<void> {
    this.setLoading(true);
    this.setError(null);
    this.setClientList([]);

    await lastValueFrom(
      this.clientService.getClients(options).pipe(
        tap(data => this.setClientList(data.dados)),
        catchError(error => this.handleError(error)),
        finalize(() => this.setLoading(false))
      )
    );
  }

  setClientList(clientList: any) {
    this.state.update(state => ({
      ...state,
      clientList,
    }));
  }

  setView(view: ClientModuleState['view']) {
    this.state.update(state => ({
      ...state,
      view,
    }));
    localStorage.setItem('clientView', view);
  }

  setSearchTerm(searchTerm: string) {
    this.state.update(state => ({
      ...state,
      searchTerm,
    }));
  }

  private setLoading(loading: boolean) {
    this.state.update(state => ({
      ...state,
      loading,
    }));
  }

  private handleError(error: any): Observable<Client[]> {
    this.setError('Erro ao carregar os clientes');
    console.error('Erro ao buscar clientes:', error);
    return of([]);
  }

  private setError(error: string | null) {
    this.state.update(state => ({
      ...state,
      error,
    }));
  }

  constructor() {}
}
