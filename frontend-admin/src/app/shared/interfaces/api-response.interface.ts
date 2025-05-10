export interface ApiResponse<T = any> {
  status: boolean;
  message: string;
  data: T;
  errors?: string[];
  error?: string;
  errorMessage?: string;
  errorCode?: string;
  errorDescription?: string;
  errorDetails?: string;
  errorType?: string;
  errorStatus?: string;
  errorStatusCode?: number;
  errorStatusText?: string;
  errorStatusMessage?: string;
  errorStatusDescription?: string;
  errorStatusDetails?: string;
  errorStatusType?: string;
  errorStatusCodeDescription?: string;
  errorStatusCodeDetails?: string;
  errorStatusCodeType?: string;
  errorStatusCodeMessage?: string;
}
