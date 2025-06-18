import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import {
  Category,
  CategoryModuleState,
} from 'app/shared/interfaces/category-module.interface';
import { catchError, finalize, Observable, of, tap } from 'rxjs';
import { environments } from 'src/environments/environments';
import { ApiResponse } from '../interfaces/api-response.interface';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryState {
  private http = inject(HttpClient);
  private apiUrl = environments.apiUrl;

  private state = signal<CategoryModuleState>({
    categoryList: [],
    view:
      (localStorage.getItem('categoryView') as CategoryModuleState['view']) ||
      'table',
    loading: false,
    error: null,
  });

  categoryList = computed(() => this.state().categoryList);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);
  currentView = computed(() => this.state().view);

  getCategoryList(): void {
    this.setLoading(true);
    this.setError(null);
    this.setCategoryList([]);

    lastValueFrom(
      this.http
        .get<ApiResponse<Category[]>>(`${this.apiUrl}category/all`, {
          headers: { 'Skip-Loader': 'true' },
        })
        .pipe(
          tap(data => this.setCategoryList(data.dados)),
          catchError(error => this.handleError(error)),
          finalize(() => this.setLoading(false))
        )
    );
  }

  setCategoryList(categoryList: any) {
    this.state.update(state => ({
      ...state,
      categoryList,
    }));

    console.log('Category list updated:', this.state().categoryList);
  }

  setView(view: CategoryModuleState['view']) {
    this.state.update(state => ({
      ...state,
      view,
    }));
    localStorage.setItem('categoryView', view);
  }

  private setLoading(loading: boolean) {
    this.state.update(state => ({
      ...state,
      loading,
    }));
  }

  private handleError(error: any): Observable<Category[]> {
    this.setError('Erro ao carregar as categorias');
    console.error('Erro ao buscar categorias:', error);
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
