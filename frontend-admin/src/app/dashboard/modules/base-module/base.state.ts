import { computed, inject, Injectable, signal } from '@angular/core';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { BaseState as BaseStateClass } from 'app/shared/store/base.state';
import { catchError, finalize, lastValueFrom } from 'rxjs';
import { environments } from 'src/environments/environments';
import { HttpClient } from '@angular/common/http';

import { BaseModuleState as BaseModuleStateInterface } from 'app/shared/store/base.state';

export interface BaseModuleState extends BaseModuleStateInterface {
  baseList: Base[];
  view: 'table' | 'list'; // Tipo de visualização atual (tabela ou lista)
  orderFilter: string; // Filtro atual aplicado à lista de bases
  searchTerm: string;
}

export interface Base {
  name: string;
  sku: string;
  category: string;
  brand: string;
  initialPrice: number;
  finalPrice: number;
  stock: number;
  shortDescription: string;
  description: string;
  imageUrl: string;

  loading?: boolean; // Indica se o base está sendo carregado
}


@Injectable({
  providedIn: 'root',
})
export class BaseState extends BaseStateClass<BaseModuleState> {
  private http = inject(HttpClient);
  private apiUrl = environments.apiUrl;

  protected state = signal<BaseModuleState>({
    baseList: [],
    view:
      (localStorage.getItem('baseView') as BaseModuleState['view']) ||
      'table',
    loading: false,
    error: null,
    orderFilter: '',
    searchTerm: '',
  });

  baseList = computed(() => this.state().baseList);
  currentView = computed(() => this.state().view);
  currentOrderFilter = computed(() => this.state().orderFilter);
  currentSearchTerm = computed(() => this.state().searchTerm);

  orderBaseList = computed(() => {
    const state = this.state();
    const filter = state.orderFilter;
    const searchTerm = state.searchTerm;
    const baseList = state.baseList;

    let filteredBases = [...baseList];

    filteredBases.sort((a, b) => {
      if (filter === 'low-price') {
        return a.finalPrice - b.finalPrice;
      } else if (filter === 'high-price') {
        return b.finalPrice - a.finalPrice;
      } else if (filter === 'az') {
        return a.name.localeCompare(b.name);
      } else if (filter === 'za') {
        return b.name.localeCompare(a.name);
      }
      return 0; // Default case, no sorting
    });

    if (searchTerm.trim()) {
      filteredBases = filteredBases.filter(base =>
        base.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filteredBases;
  });

  async getBaseList(): Promise<void> {
    this.setLoading(true);
    this.clearError();
    this.setBaseList([]);

    await lastValueFrom(
      this.http
        .get<ApiResponse<Base[]>>(`${this.apiUrl}base/all`, {
          headers: { 'Skip-Loader': 'true' },
        })
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

  setView(view: BaseModuleState['view']) {
    this.updateState('view', view);
    localStorage.setItem('baseView', view);
  }

  setOrderFilter(filter: string) {
    this.updateState('orderFilter', filter);
  }

  setSearchTerm(searchTerm: string) {
    this.updateState('searchTerm', searchTerm);
  }

  constructor() {
    super();
  }
}
