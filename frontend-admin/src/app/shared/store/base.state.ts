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
	 * Define o estado de loading
	 */
	protected setLoading(loading: boolean): void {
		this.state.update(state => ({
			...state,
			loading,
		}));
	}

	/**
	 * Define uma mensagem de erro
	 */
	protected setError(error: string | null): void {
		this.state.update(state => ({
			...state,
			error,
		}));
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
	protected handleError(error: any, defaultMessage = 'Erro ao carregar dados'): Observable<any> {
		const errorMessage = typeof error === 'string' ? error : defaultMessage;
		console.error('Erro capturado:', error);
		this.setError(errorMessage);
		return of(null);
	}

}
