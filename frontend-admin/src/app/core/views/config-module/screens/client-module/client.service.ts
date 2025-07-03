import { inject, Injectable } from '@angular/core';
import { environments } from 'src/environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private apiUrl = environments.apiUrl;
  private http = inject(HttpClient);

  constructor() {}

  getClients(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}client/getAll`)
  }

}
