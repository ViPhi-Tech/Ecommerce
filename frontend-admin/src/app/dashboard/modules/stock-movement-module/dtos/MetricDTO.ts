export interface MetricDTO {
  date: string;
  type: 'IN' | 'OUT';
}

export interface MetricResponse {
  total: number;
}
