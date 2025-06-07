export interface IPaymentService {
  createCharge(data: any): Promise<any>;
  getChargeStatus(chargeId: string): Promise<any>;
  refundCharge(chargeId: string, amount?: number): Promise<any>;
}