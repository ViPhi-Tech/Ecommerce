export interface SalesByMonth {
  month: string
  total: number
}

export interface ResponseChart {
    name: string
    total: number
}
export interface ChartDataResponse {
  salesByMonth: SalesByMonth[]
  topProducts: ResponseChart[]
  orderStatus: ResponseChart[]
  salesByCategory: ResponseChart[]
}