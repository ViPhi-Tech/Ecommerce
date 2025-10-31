import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { IViaCepResponse } from '../interfaces/viacep/ViaCepResponse';

@Injectable({
  providedIn: 'root',
})
export class ViaCepService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'https://viacep.com.br/ws';

  /**
   * Busca endereço por CEP
   * @param zipCode CEP sem formatação (apenas números)
   * @returns Observable com a resposta da API ViaCEP
   */
  getAddressByZipCode(zipCode: string): Observable<IViaCepResponse> {
    const cleanZipCode = zipCode.replace(/\D/g, '');
    
    if (cleanZipCode.length !== 8) {
      return throwError(() => new Error('CEP deve conter 8 dígitos'));
    }

    return this.http.get<IViaCepResponse>(
      `${this.baseUrl}/${cleanZipCode}/json`
    );
  }
}

