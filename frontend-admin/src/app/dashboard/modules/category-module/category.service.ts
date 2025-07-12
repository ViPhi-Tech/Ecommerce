import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { Observable, Subject } from 'rxjs';
import { environments } from 'src/environments/environments';
import { Category } from './category.state';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);
  private apiUrl = environments.apiUrl + 'category';

  private refreshSubj = new Subject<any>();
  refresh$ = this.refreshSubj.asObservable();

  constructor() {}

  getCategories(skipLoader = true): Observable<ApiResponse> {
    const headers = skipLoader ? { 'Skip-Loader': 'true' } : undefined;
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/all`, {
      headers,
    });
  }

  getCategoryById(categoryId: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/${categoryId}`, {
      params: { id: categoryId },
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
    this.refreshSubj.next(true);
  }
}
