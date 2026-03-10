import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
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
  private router = inject(Router);

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

  /**
   * Cria/define senha a partir do link recebido por e-mail.
   * O token vem da query string da página (?token=...); envia token + password para POST /create-password.
   */
  createPassword(token: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}auth/create-password`,
      { token, password },
      { headers: { 'Skip-Loader': 'true' } }
    );
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

  checkAnyRole(roles: string[]): boolean {
    const decodedToken = this.getDecodedToken();
    if (decodedToken && decodedToken['roles']) {
      const userRoles: string[] = decodedToken['roles'];
      return roles.some(role => userRoles.includes(role));
    }
    return false;
  }

  /**
   * Realiza logout do usuário removendo tokens e redirecionando para login
   */
  logout(): void {
    // Remove tokens do localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // Limpa outros dados de sessão se necessário
    localStorage.clear();
    
    // Redireciona para a página de login
    this.router.navigate(['/auth/login']);
  }

  /**
   * Logout forçado em caso de token inválido/expirado (401)
   */
  forceLogout(): void {
    console.warn('Sessão expirada ou token inválido. Redirecionando para login...');
    this.logout();
  }
}
