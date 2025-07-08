import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { Observable } from 'rxjs';
import { environments } from 'src/environments/environments';
import {
  User,
  UserCreate,
  UserUpdate,
} from 'app/shared/interfaces/user-module.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = environments.apiUrl + 'user';

  refreshUserList$ = signal<any>(undefined);

  constructor() {}

  getUserById(userId: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/${userId}`);
  }

  getUsersList(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(`${this.apiUrl}/all`);
  }

  // Define methods for user operations here
  upsertUser(
    userData: UserCreate | (UserUpdate & { id?: string })
  ): Observable<ApiResponse> {
    if (userData?.id) {
      // Update existing user
      return this.http.put<ApiResponse>(
        `${this.apiUrl}/update/${userData?.id}`,
        userData
      );
    }
    // Create new user
    return this.http.post<ApiResponse>(`${this.apiUrl}/create`, userData);
  }

  deleteUser(userId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${userId}`);
  }

  refreshUserList() {
    this.refreshUserList$.set(Math.random());
  }
}
