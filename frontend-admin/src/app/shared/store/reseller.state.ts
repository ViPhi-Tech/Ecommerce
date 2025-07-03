import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, Observable, of, tap } from 'rxjs';
import { environments } from 'src/environments/environments';
import {
  Reseller,
  ResellerModuleState,
} from '../interfaces/reseller-module.interface';

@Injectable({
  providedIn: 'root'
})
export class ResellerState {
  private http = inject(HttpClient);
  private apiUrl = environments.apiUrl;

  private state = signal<ResellerModuleState>({
    resellerList: [],
    loading: false,
    error: null,
  });

  resellerList = computed(() => this.state().resellerList);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);

  getResellerList(): void {
    this.setLoading(true);
    this.setError(null);
    this.setResellerList([]);

    this.http
      .get<Reseller[]>(`${this.apiUrl}resellers`)
      .pipe(
        tap(resellers => this.setResellerList(resellers)),
        catchError(error => this.handleError(error)),
        finalize(() => this.setLoading(false))
      )
      .subscribe();
  }

  setResellerList(resellerList: any) {
    this.state.update(state => ({
      ...state,
      resellerList,
    }));
  }

  private setLoading(loading: boolean) {
    this.state.update(state => ({
      ...state,
      loading,
    }));
  }

  private handleError(error: any): Observable<Reseller[]> {
    this.setError('Erro ao carregar os produtos');
    console.error('Erro ao buscar produtos:', error);
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
