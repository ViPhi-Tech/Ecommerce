export interface IReportType {
  id: string;
  label: string;
  description: string;
  columns: IReportColumn[];
}

export interface IReportColumn {
  field: string;
  caption: string;
  type?: 'text' | 'currency' | 'date' | 'number' | 'status';
  sortable?: boolean;
  filter?: boolean;
}

export interface IReportFilter {
  reportType: string;
  periodType:
    | 'current_month'
    | 'last_7_days'
    | 'last_15_days'
    | 'last_30_days'
    | 'custom';
  startDate?: string;
  endDate?: string;
}

export interface ISalesReport {
  id: string;
  date: string;
  client: string;
  product: string;
  quantity: number;
  totalValue: number;
}

export interface IStockReport {
  id: string;
  product: string;
  category: string;
  currentQuantity: number;
  lastMovement: string;
}

export interface IFinancialReport {
  id: string;
  date: string;
  type: 'receita' | 'despesa';
  value: number;
  status: 'pendente' | 'pago' | 'vencido';
  notes?: string;
}

export interface IClientReport {
  id: string;
  name: string;
  email: string;
  phone: string;
  registrationDate: string;
  status: 'ativo' | 'inativo';
}

export type ReportData =
  | ISalesReport
  | IStockReport
  | IFinancialReport
  | IClientReport;
