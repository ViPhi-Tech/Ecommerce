import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  AuthResponse,
  ChangePasswordRequest,
} from 'app/shared/interfaces/auth.interfaces';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import { environments } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  apiUrl = environments?.apiUrl;

  constructor() {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post(
      `${this.apiUrl}auth/token/angular`,
      {
        email,
        password,
      },
      {
        headers: { 'Skip-Loader': 'true' },
      }
    ) as Observable<AuthResponse>;
  }

  changePassword(data: ChangePasswordRequest): Observable<AuthResponse> {
    return this.http.put(`${this.apiUrl}auth/change-password`, data, {
      headers: { 'Skip-Loader': 'true' },
    }) as Observable<AuthResponse>;
  }

  setToken(token: string, name = 'accessToken') {
    // setar o token no local storage
    localStorage.setItem(name, token);
  }

  // pegar o token do local storage
  getToken(name = 'accessToken'): string | null {
    const token = localStorage.getItem(name);
    return token;
  }

  // decodificar o token JWT
  getDecodedToken(name = 'accessToken'): any | null {
    const token = this.getToken(name);
    if (token) {
      try {
        return jwtDecode(token);
      } catch (error) {
        console.error('Erro ao decodificar token:', error);
        return null;
      }
    }
    return null;
  }

  isLoggedIn(): boolean {
    const decodedToken = this.getDecodedToken();
    if (decodedToken) {
      if (decodedToken && decodedToken['exp']) {
        const expirationDate = new Date(decodedToken['exp'] * 1000);
        return expirationDate > new Date();
      }
      return false;
    }
    return false;
  }
}
