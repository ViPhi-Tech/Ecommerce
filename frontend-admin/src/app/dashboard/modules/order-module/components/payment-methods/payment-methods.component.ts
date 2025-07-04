import { Component, OnInit, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconColor: string;
  discount?: string;
  discountColor?: string;
}

@Component({
  selector: 'fuse-payment-methods',
  templateUrl: './payment-methods.component.html',
  imports: [NgIcon, DialogModule, ButtonModule],
})
export class PaymentMethodsComponent implements OnInit {
  visible = signal(false);

  // Dados das formas de pagamento
  paymentMethods = signal<PaymentMethod[]>([
    {
      id: 'pix',
      name: 'PIX',
      description: 'Pagamento instantâneo',
      icon: 'lucideSmartphone',
      iconColor: 'text-green-600',
      discount: '5% desconto',
      discountColor: 'text-green-600',
    },
    {
      id: 'cartao',
      name: 'Cartão de Crédito/Débito',
      description: 'Visa, Mastercard, Elo',
      icon: 'lucideCreditCard',
      iconColor: 'text-blue-600',
    },
    {
      id: 'dinheiro',
      name: 'Dinheiro',
      description: 'Pagamento na entrega/retirada',
      icon: 'lucideBanknote',
      iconColor: 'text-green-700',
    },
    {
      id: 'carteira',
      name: 'Carteira Digital',
      description: 'PicPay, PayPal, Mercado Pago',
      icon: 'lucideWallet',
      iconColor: 'text-purple-600',
    },
  ]);

  // Forma de pagamento selecionada - agora salva o objeto inteiro
  selectedPaymentMethod = signal<PaymentMethod | null>(null);

  constructor() {}

  ngOnInit() {}

  onPaymentMethodChange(paymentMethod: PaymentMethod) {
    this.selectedPaymentMethod.set(paymentMethod);
    this.visible.set(false);
  }
}
