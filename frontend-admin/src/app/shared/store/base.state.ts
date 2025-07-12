import { computed, signal } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface BaseModuleState {
  loading: boolean;
  error: string | null;
}

export abstract class BaseState<T extends BaseModuleState> {
  protected abstract state: ReturnType<typeof signal<T>>;

  // Computed signals comuns
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);

  /**
   * Atualiza o estado de um campo específico
   * @param key Chave do campo a ser atualizado
   * @param value Novo valor para o campo
   */
  protected updateState<K extends keyof T>(key: K, value: T[K]): void {
    this.state.update(state => ({
      ...state,
      [key]: value,
    }));
  }

  /**
   * Define o estado de loading
   */
  protected setLoading(loading: boolean): void {
    this.updateState('loading', loading);
  }

  /**
   * Define uma mensagem de erro
   */
  protected setError(error: string | null): void {
    this.updateState('error', error);
  }

  /**
   * Limpa o erro atual
   */
  protected clearError(): void {
    this.setError(null);
  }

  /**
   * Manipula erros de forma padronizada
   */
  protected handleError(
    error: any,
    defaultMessage = 'Erro ao carregar dados'
  ): Observable<any> {
    const errorMessage = typeof error === 'string' ? error : defaultMessage;
    console.error('Erro capturado:', error);
    this.setError(errorMessage);
    return of(null);
  }
}
