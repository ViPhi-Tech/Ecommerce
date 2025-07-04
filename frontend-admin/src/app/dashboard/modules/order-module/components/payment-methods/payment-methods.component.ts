import { Component, inject, OnInit, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CartState } from '../order-cart/order-cart.state';

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
  public cartState = inject(CartState);

  visible = signal(false);
  // Dados das formas de pagamento
  paymentMethods = signal<PaymentMethod[]>([
    {
      id: 'pix',
      name: 'PIX',
      description: 'Pagamento instantâneo',
      icon: 'lucideSmartphone',
      iconColor: '#16a34a', // Verde direto
      discount: '5% desconto',
      discountColor: '#16a34a', // Verde direto
    },
    {
      id: 'cartao',
      name: 'Cartão de Crédito/Débito',
      description: 'Visa, Mastercard, Elo',
      icon: 'lucideCreditCard',
      iconColor: '#2563eb', // Azul direto
    },
    {
      id: 'dinheiro',
      name: 'Dinheiro',
      description: 'Pagamento na entrega/retirada',
      icon: 'lucideBanknote',
      iconColor: '#15803d', // Verde escuro direto
    },
    {
      id: 'carteira',
      name: 'Carteira Digital',
      description: 'PicPay, PayPal, Mercado Pago',
      icon: 'lucideWallet',
      iconColor: '#9333ea', // Roxo direto
    },
  ]);

  constructor() {}

  ngOnInit() {}

  onPaymentMethodChange(paymentMethod: PaymentMethod) {
    this.cartState.setPaymentMethod(paymentMethod);
    this.visible.set(false);
  }
}
