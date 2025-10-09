export interface GetOrders {
    clientId?: number;
    startDate: string; 
    endDate: string;   
    paymentTypeId?: string;
}