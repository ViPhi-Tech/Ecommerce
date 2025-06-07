import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { IPaymentService } from '../../domain/services/IPaymentService';
import { PaymentOrder } from '../../shared/types/PaymentOrder';
export class PagBankService implements IPaymentService {
  private readonly token: string = '9F37C4AC1DCF447E8A106DFF575DC4C2';
  private readonly apiUrl: string = 'https://sandbox.pagbank.com.br';
  private readonly idempotencyKey: string = uuidv4();
  constructor(token: string) {
    this.token = token;

  }

  async createOrder(data: any): Promise<any> {
    const response = await axios.post(`${this.apiUrl}/orders`, data, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
    return response.data;
  }

  async createCharge(data: any): Promise<any> {
    const response = await axios.post(`${this.apiUrl}/charges`, data, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
    return response.data;
  }

  async getChargeStatus(chargeId: string): Promise<any> {
    const response = await axios.get(`${this.apiUrl}/charges/${chargeId}`, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
    return response.data;
  }

  async refundCharge(chargeId: string, amount?: number): Promise<any> {
    const response = await axios.post(`${this.apiUrl}/charges/${chargeId}/refunds`, { amount }, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
    return response.data;
  }
}