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
  selector: 'fuse-payment-selection',
  templateUrl: './payment-selection.component.html',
  imports: [NgIcon, DialogModule, ButtonModule],
})
export class PaymentSelectionComponent implements OnInit {
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
      id: 'credit',
      name: 'Cartão de Crédito',
      description: 'Visa, Mastercard, Elo',
      icon: 'lucideCreditCard',
      iconColor: '#2563eb', // Azul direto
    },

    {
      id: 'debit',
      name: 'Cartão de Débito',
      description: 'Visa, Mastercard, Elo',
      icon: 'lucideCreditCard',
      iconColor: '#2563eb', // Azul direto
    },
    {
      id: 'money',
      name: 'Dinheiro',
      description: 'Pagamento na entrega/retirada',
      icon: 'lucideBanknote',
      iconColor: '#15803d', // Verde escuro direto
    },
  ]);

  constructor() {}

  ngOnInit() {}

  onPaymentMethodChange(paymentMethod: PaymentMethod) {
    this.cartState.addPaymentMethod(paymentMethod);
    // Não fechamos mais o modal automaticamente para permitir múltiplas seleções
  }

  closeModal() {
    this.visible.set(false);
  }

  isPaymentMethodSelected(paymentMethodId: string): boolean {
    return this.cartState.isPaymentMethodSelected(paymentMethodId);
  }
}
