
export interface MetricDTO {
  date: string;
  type?: "IN" | "OUT" | null;
}

export interface MetricResponse {
    stockTotal: number;
    movimentIn: number;
    movimentOut: number;
}