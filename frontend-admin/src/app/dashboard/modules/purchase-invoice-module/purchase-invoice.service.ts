import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { Observable } from 'rxjs';
import { environments } from 'src/environments/environments';

export interface PurchaseInvoice {
  id: number;
  accessKey: string;
  number: string;
  series: string;
  model: number;
  issueDate: Date | string;
  entryDate: Date | string;
  totalAmount: number;
  totalTax: number;
  supplierId: number;
  supplier?: {
    id: number;
    name: string;
    tradeName?: string;
    document?: string;
  };
  items?: PurchaseInvoiceItem[];
  createdAt?: Date | string;
}

export interface PurchaseInvoiceItem {
  id: number;
  purchaseInvoiceId: number;
  productId?: number | null;
  code?: string | null;
  description: string;
  ncm: string;
  cst?: string | null;
  cfop: string;
  unit?: string | null;
  quantity: number;
  unitPrice: number;
  discount?: number | null;
  totalAmount: number;
  icmsBase?: number | null;
  icmsValue?: number | null;
  icmsRate?: number | null;
  icmsStBase?: number | null;
  icmsStValue?: number | null;
  ipiValue?: number | null;
  ipiRate?: number | null;
  unitCost?: number | null;
  unitTotalWithTax?: number | null;
  totalCost?: number | null;
  totalWithTax?: number | null;
  product?: {
    id: number;
    name: string;
    sku: string;
    ean?: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class PurchaseInvoiceService {
  private http = inject(HttpClient);
  private apiUrl = environments.apiUrl + 'purchase-invoice';

  constructor() {}

  getAllPurchaseInvoices(skipLoader = true): Observable<ApiResponse<PurchaseInvoice[]>> {
    const headers = skipLoader ? { 'Skip-Loader': 'true' } : undefined;
    return this.http.get<ApiResponse<PurchaseInvoice[]>>(`${this.apiUrl}/`, {
      headers,
    });
  }

  getPurchaseInvoiceById(id: string | number): Observable<ApiResponse<PurchaseInvoice>> {
    return this.http.get<ApiResponse<PurchaseInvoice>>(`${this.apiUrl}/${id}`);
  }
}
