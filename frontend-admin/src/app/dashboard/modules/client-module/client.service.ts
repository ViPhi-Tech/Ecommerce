import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { IClient } from 'app/shared/interfaces/client/Client';
import { Observable, Subject } from 'rxjs';
import { environments } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private http = inject(HttpClient);
  private apiUrl = environments.apiUrl + 'client';

  private refreshSubj = new Subject<any>();
  refresh$ = this.refreshSubj.asObservable();

  private onCreateClient = new Subject<any>();
  onClientCreate$ = this.onCreateClient.asObservable();

  constructor() {}

  getClients(skipLoader = true): Observable<ApiResponse> {
    const headers = skipLoader ? { 'Skip-Loader': 'true' } : undefined;
    return this.http.get<ApiResponse<IClient[]>>(`${this.apiUrl}/getAll`, {
      headers,
    });
  }

  getClientById(clientId: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/findById/${clientId}`);
  }

  // Define methods for client operations here
  upsertClient(clientData: any): Observable<ApiResponse> {
    if (clientData.id) {
      // Update existing client
      return this.http.put<ApiResponse>(
        `${this.apiUrl}/update/${clientData.id}`,
        clientData
      );
    }
    // Create new client
    return this.http.post<ApiResponse>(`${this.apiUrl}/create`, clientData);
  }

  deleteClient(clientId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/delete/${clientId}`);
  }

  refreshClientList() {
    this.refreshSubj.next(true);
  }

  createClientRefresh() {
    this.onCreateClient.next(true);
  }
}
