
export interface MetricDTO {
  date: string;
  type?: "IN" | "OUT" | null;
}

export interface MetricResponse {
    total: number
}