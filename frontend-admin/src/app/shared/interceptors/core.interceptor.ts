import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CoreService } from '../services/core.service';

export function CoreInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const coreService = inject(CoreService);

  // Verifica se o cabeçalho 'Skip-Loader' está presente
  const skipLoader = req.headers.has('Skip-Loader');

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
        params: cleanedParams
      });
    }
  }

  const newReq = cleanedRequest.clone({
    withCredentials: true,
    setHeaders: headers,
  });

  return next(newReq).pipe(
    finalize(() => {
      if (!skipLoader) {
        coreService.hideLoader();
      }
    })
  );
}
