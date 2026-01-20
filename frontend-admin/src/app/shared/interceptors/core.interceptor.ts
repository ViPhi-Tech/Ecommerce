import { HttpEvent, HttpHandlerFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { finalize, catchError } from 'rxjs/operators';
import { CoreService } from '../services/core.service';
import { AuthService } from '../../core/auth/auth.service';

export function CoreInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const coreService = inject(CoreService);
  const authService = inject(AuthService);

  // Verifica se o cabeçalho 'Skip-Loader' está presente
  const skipLoader = req.headers.has('Skip-Loader');

  // Verifica se é uma requisição para API externa (ex: ViaCEP, BrasilAPI)
  const isViaCep = req.url.includes('viacep.com.br');
  
  // Se for API externa, não aplica credenciais, headers de autenticação nem loader
  if (isViaCep) {
    return next(req);
  }

  if (!skipLoader) {
    coreService.showLoader();
  }

  const accessToken = localStorage.getItem('accessToken');

  const headers: Record<string, string> = {
    Authorization: accessToken ? `Bearer ${accessToken}` : '',
  };

  if (req.method === 'POST' || req.method === 'PUT') {
    headers['Content-Type'] = 'application/json';
  }

  // Limpar query params null (manter 0, false, etc.)
  let cleanedRequest = req;
  if (req.params && req.params.keys().length > 0) {
    let hasNullParams = false;
    let cleanedParams = req.params;

    // Remove todos os parâmetros primeiro
    req.params.keys().forEach(key => {
      cleanedParams = cleanedParams.delete(key);
    });

    // Adiciona de volta apenas os parâmetros que não são null
    req.params.keys().forEach(key => {
      const value = req.params.get(key);
      // Remove apenas valores explicitamente null ou string 'null'
      if (value !== null && value !== 'null') {
        cleanedParams = cleanedParams.set(key, value);
      } else {
        hasNullParams = true;
      }
    });

    if (hasNullParams) {
      cleanedRequest = req.clone({
        params: cleanedParams,
      });
    }
  }

  const newReq = cleanedRequest.clone({
    withCredentials: true,
    setHeaders: headers,
  });

  return next(newReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Se a resposta for 401 (Não Autorizado), faz logout automático
      if (error.status === 401) {
        // Verifica se não é uma requisição de login para evitar loop infinito
        const isLoginRequest = req.url.includes('/auth/token') || req.url.includes('/auth/login');
        
        if (!isLoginRequest) {
          console.error('Erro 401 detectado. Fazendo logout automático...');
          authService.forceLogout();
        }
      }
      
      // Re-lança o erro para que outros manipuladores possam tratá-lo
      return throwError(() => error);
    }),
    finalize(() => {
      if (!skipLoader) {
        coreService.hideLoader();
      }
    })
  );
}
