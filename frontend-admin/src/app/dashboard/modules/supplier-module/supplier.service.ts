import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { ISupplier } from 'app/shared/interfaces/supplier/Supplier';
import { Observable, Subject, tap } from 'rxjs';
import { environments } from 'src/environments/environments';
import { SupplierState } from './supplier.state';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private http = inject(HttpClient);
  private supplierState = inject(SupplierState);
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
  upsertSupplier(supplierData: ISupplier): Observable<ApiResponse> {
    const operation = supplierData.id
      ? this.http.put<ApiResponse>(
          `${this.apiUrl}/update/${supplierData.uuid}`,
          supplierData
        )
      : this.http.post<ApiResponse>(`${this.apiUrl}/create`, supplierData);

    // Invalida o cache após criar ou atualizar
    return operation.pipe(
      tap(() => {
        this.supplierState.invalidateCache();
      })
    );
  }

  deleteSupplier(supplierId: string): Observable<ApiResponse> {
    // Invalida o cache após deletar
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${supplierId}`).pipe(
      tap(() => {
        this.supplierState.invalidateCache();
      })
    );
  }

  refreshSupplierList() {
    this.refreshSubj.next(true);
  }
}
