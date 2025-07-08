import { computed, inject, Injectable, signal } from '@angular/core';
import { BaseState as BaseStateClass } from 'app/shared/store/base.state';
import { catchError, finalize, lastValueFrom } from 'rxjs';
import { environments } from 'src/environments/environments';
import { HttpClient } from '@angular/common/http';

import { BaseModuleState as BaseModuleStateInterface } from 'app/shared/store/base.state';
import { BaseService } from './base.service';

export interface BaseModuleState extends BaseModuleStateInterface {
  baseList: Base[];
  view?: 'table' | 'list'; // Tipo de visualização atual (tabela ou lista)
}

export interface Base {
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class BaseState extends BaseStateClass<BaseModuleState> {
  private service = inject(BaseService);

  protected state = signal<BaseModuleState>({
    baseList: [],
    view:
      (localStorage.getItem('baseView') as BaseModuleState['view']) || 'table',
    loading: false,
    error: null,
  });

  baseList = computed(() => this.state().baseList);
  currentView = computed(() => this.state().view);

  async getBaseList(): Promise<void> {
    this.setLoading(true);
    this.clearError();
    this.setBaseList([]);

    await lastValueFrom(
      this.service.getAll()
        .pipe(
          catchError(error => this.handleError(error)),
          finalize(() => this.setLoading(false))
        )
    )
      .then((response: any) => {
        const bases = Array.isArray(response) ? response : response.dados;
        if (bases && bases.length > 0) {
          this.setBaseList(bases);
        } else {
          this.setBaseList([]);
          this.setError('Nenhum base encontrado.');
        }
      })
      .catch(error => {
        this.setError('Erro ao carregar a lista de bases');
        console.error('Erro ao buscar bases:', error);
      });
  }

  setBaseList(baseList: Base[]) {
    this.updateState('baseList', baseList);
  }

  constructor() {
    super();
  }
}
