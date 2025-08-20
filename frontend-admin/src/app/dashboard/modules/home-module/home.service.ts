import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { ChartsMetrics } from 'app/shared/interfaces/home/HomeModuleState';
import { Observable } from 'rxjs';
import { environments } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private http = inject(HttpClient);
  private apiUrl = environments.apiUrl + 'dashboard';

  refreshDashboard$ = signal<any>(undefined);

  constructor() {}

  getDashboardMetrics(
    period: 'today' | 'week' | 'month' | 'year' = 'month',
    skipLoader = true
  ): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/metrics`, {
      params: { period },
      headers: { 'Skip-Loader': skipLoader ? 'true' : 'false' },
    });
  }

  getDashboardCharts(): Observable<ApiResponse<ChartsMetrics>> {
    return this.http.get<ApiResponse<ChartsMetrics>>(`${this.apiUrl}/charts`);
  }
}
