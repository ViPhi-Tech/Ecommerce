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

  const newReq = req.clone({
    withCredentials: true,
    setHeaders: {
      Authorization: accessToken ? `Bearer ${accessToken}` : '',
      'Content-Type': 'application/json',
    },
  });

  return next(newReq).pipe(
    finalize(() => {
      if (!skipLoader) {
        coreService.hideLoader();
      }
    })
  );
}
