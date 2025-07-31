import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { ISupplier } from 'app/shared/interfaces/supplier/Supplier';
import { Observable, Subject } from 'rxjs';
import { environments } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private http = inject(HttpClient);
  private apiUrl = environments.apiUrl + 'supplier';

  private refreshSubj = new Subject<any>();
  refresh$ = this.refreshSubj.asObservable();

  constructor() {}

  getSuppliers(skipLoader = true): Observable<ApiResponse> {
    const headers = skipLoader ? { 'Skip-Loader': 'true' } : undefined;
    return this.http.get<ApiResponse<ISupplier[]>>(`${this.apiUrl}/all`, {
      headers,
    });
  }

  getSupplierById(supplierId: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/${supplierId}`, {
      params: { id: supplierId },
    });
  }

  // Define methods for supplier operations here
  upsertSupplier(supplierData: any): Observable<ApiResponse> {
    if (supplierData.id) {
      // Update existing supplier
      return this.http.put<ApiResponse>(`${this.apiUrl}/update`, supplierData);
    }
    // Create new supplier
    return this.http.post<ApiResponse>(`${this.apiUrl}/create`, supplierData);
  }

  deleteSupplier(supplierId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${supplierId}`);
  }

  refreshSupplierList() {
    this.refreshSubj.next(true);
  }
}
