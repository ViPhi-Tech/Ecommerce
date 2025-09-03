import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { DashboardCharts } from 'app/shared/interfaces/home/HomeModuleState';
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

  getDashboardCharts(
    period: 'today' | 'week' | 'month' | 'year' = 'month',
    skipLoader = true
  ): Observable<ApiResponse<DashboardCharts>> {
    return this.http.get<ApiResponse<DashboardCharts>>(`${this.apiUrl}/charts`, {
      params: { period },
      headers: { 'Skip-Loader': skipLoader ? 'true' : 'false' },
    });
  }
}
