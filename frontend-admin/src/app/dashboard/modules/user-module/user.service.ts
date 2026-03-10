import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { IUser } from 'app/shared/interfaces/user/User';
import { IUserCreate } from 'app/shared/interfaces/user/UserCreate';
import { IUserUpdate } from 'app/shared/interfaces/user/UserUpdate';
import { Observable } from 'rxjs';
import { environments } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = environments.apiUrl + 'user';

  refreshUserList$ = signal<any>(undefined);

  constructor() {}

  getUserById(userId: string, skipLoader = true): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/${userId}`, {
      headers: { 'Skip-Loader': skipLoader ? 'true' : 'false' },
    });
  }

  getUsersList(skipLoader = true): Observable<ApiResponse<IUser[]>> {
    return this.http.get<ApiResponse<IUser[]>>(`${this.apiUrl}/all`, {
      headers: { 'Skip-Loader': skipLoader ? 'true' : 'false' },
    });
  }

  // Define methods for user operations here
  upsertUser(
    userData: IUserCreate | (IUserUpdate & { id?: string })
  ): Observable<ApiResponse> {
    if (userData?.id) {
      // Update existing user
      return this.http.put<ApiResponse>(`${this.apiUrl}/${userData.id}`, userData);
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
