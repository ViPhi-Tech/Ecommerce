import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { Observable } from 'rxjs';
import { environments } from 'src/environments/environments';

@Injectable()
export class CategoryService {
  private http = inject(HttpClient);
  private apiUrl = environments.apiUrl + 'category';

  refreshCategoryList$ = signal<any>(undefined);

  constructor() {}

  getCategoryById(categoryId: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/${categoryId}`, {
      params: { id: categoryId }
    });
  }

  // Define methods for category operations here
  upsertCategory(categoryData: any): Observable<ApiResponse> {
    if (categoryData.id) {
      // Update existing category
      return this.http.put<ApiResponse>(`${this.apiUrl}/update`, categoryData);
    }
    // Create new category
    return this.http.post<ApiResponse>(`${this.apiUrl}/create`, categoryData);
  }

  deleteCategory(categoryId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${categoryId}`);
  }

  refreshCategoryList() {
    this.refreshCategoryList$.set(Math.random());
  }
}
