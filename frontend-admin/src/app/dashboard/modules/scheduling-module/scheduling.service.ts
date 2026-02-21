import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { Observable } from 'rxjs';
import { environments } from 'src/environments/environments';

export type ScheduleStatus = 'SCHEDULED' | 'CANCELLED' | 'COMPLETED';

export interface CreateScheduleDTO {
  title: string;
  description?: string | null;
  startDateTime: Date;
  endDateTime: Date;
  location?: string | null;
  isAllDay?: boolean;
  status?: ScheduleStatus;
}

export interface UpdateScheduleDTO {
  title?: string;
  description?: string | null;
  startDateTime?: Date;
  endDateTime?: Date;
  location?: string | null;
  isAllDay?: boolean;
  status?: ScheduleStatus;
}

export interface ScheduleEntity {
  id: number;
  title: string;
  description?: string | null;
  startDateTime: string | Date;
  endDateTime: string | Date;
  location?: string | null;
  isAllDay: boolean;
  status: ScheduleStatus;
}

@Injectable({
  providedIn: 'root',
})
export class SchedulingService {
  private http = inject(HttpClient);
  private apiUrl = `${environments.apiUrl}schedule`;

  getAll(skipLoader = false): Observable<ApiResponse<ScheduleEntity[]>> {
    return this.http.get<ApiResponse<ScheduleEntity[]>>(`${this.apiUrl}/all`, {
      headers: { 'Skip-Loader': skipLoader ? 'true' : 'false' },
    });
  }

  create(payload: CreateScheduleDTO): Observable<ApiResponse<ScheduleEntity>> {
    return this.http.post<ApiResponse<ScheduleEntity>>(`${this.apiUrl}/create`, payload);
  }

  update(id: number, payload: UpdateScheduleDTO): Observable<ApiResponse<ScheduleEntity>> {
    return this.http.patch<ApiResponse<ScheduleEntity>>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
  }
}

