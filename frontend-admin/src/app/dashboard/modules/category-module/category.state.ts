import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, tap } from 'rxjs';
import { lastValueFrom } from 'rxjs';
import { CategoryService } from 'app/dashboard/modules/category-module/category.service';
import { BaseState } from 'app/shared/store/base.state';
import { CategoryModuleState } from 'app/shared/interfaces/category/CategoryModuleState';

@Injectable({
  providedIn: 'root',
})
export class CategoryState extends BaseState<CategoryModuleState> {
  private categoryService = inject(CategoryService);

  protected state = signal<CategoryModuleState>({
    categoryList: [],
    loading: false,
    error: null,
  });

  categoryList = computed(() => this.state().categoryList);

  constructor() {
    super();
  }

  async getCategoryList(skipLoader = true): Promise<void> {
    this.setLoading(true);
    this.setError(null);
    this.setCategoryList([]);

    try {
      await lastValueFrom(
        this.categoryService.getCategories(skipLoader).pipe(
          tap(data => this.setCategoryList(data.dados)),
          catchError(error => {
            this.handleError(error, 'Erro ao carregar categorias');
            throw error;
          }),
          finalize(() => this.setLoading(false))
        )
      );
    } catch (error) {
      // Erro já foi tratado no catchError
      console.error('Erro na requisição de categorias:', error);
    }
  }

  setCategoryList(categoryList: any) {
    this.updateState('categoryList', categoryList);
  }
}
