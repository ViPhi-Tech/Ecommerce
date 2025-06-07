export interface PaymentOrder {
  reference_id: string;
  customer: {
    name: string;
    email: string;
    tax_id: string;
    phones: Array<{
      country: string;
      area: string;
      number: string;
      type: string; //'MOBILE' | 'HOME' | 'BUSINESS';
    }>;
  };
  items: Array<{
    name: string;
    quantity: number;
    unit_amount: number;
  }>;
  notification_urls: string[];
  charges: Array<{
    reference_id: string;
    description: string;
    amount: {
      value: number;
      currency: string;
    };
    payment_method: {
      type: string; // = 'CREDIT_CARD'
      installments: number;
      capture: boolean;
      card: {
        encrypted: string;
        security_code: string;
        holder: {
          name: string;
        };
        store: boolean;
      };
    };
  }>;
}