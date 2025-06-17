import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import {
  Category,
  CategoryModuleState,
} from 'app/shared/interfaces/category-module.interface';
import { catchError, finalize, Observable, of, tap } from 'rxjs';
import { environments } from 'src/environments/environments';

@Injectable()
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

    this.http
      .get<Category[]>(`${this.apiUrl}categories`)
      .pipe(
        tap(categories => this.setCategoryList(categories)),
        catchError(error => this.handleError(error)),
        finalize(() => this.setLoading(false))
      )
      .subscribe();
  }

  setCategoryList(categoryList: any) {
    this.state.update(state => ({
      ...state,
      categoryList,
    }));
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
