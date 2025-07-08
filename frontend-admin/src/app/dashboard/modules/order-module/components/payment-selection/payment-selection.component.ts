import { Component, inject, OnInit, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { CartState } from '../order-cart/order-cart.state';
import { MessageService } from 'primeng/api';

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconColor: string;
  discount?: string;
  discountColor?: string;
  value?: number; // Valor pago com este método
}

@Component({
  selector: 'fuse-payment-selection',
  templateUrl: './payment-selection.component.html',
  imports: [NgIcon, ButtonModule, InputNumberModule, FormsModule, CurrencyPipe],
})
export class PaymentSelectionComponent implements OnInit {
  public toast = inject(MessageService);
  public cartState = inject(CartState);

  // Dados das formas de pagamento
  paymentMethods = signal<PaymentMethod[]>([
    {
      id: 'pix',
      name: 'PIX',
      description: 'Pagamento instantâneo',
      icon: 'lucideSmartphone',
      iconColor: '#16a34a', // Verde direto
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
    if (this.getTotalToPay() <= 0) {
      this.toast.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Não há valor a pagar no momento.',
        life: 3000,
      });
    }

    if (
      this.isPaymentMethodSelected(paymentMethod.id) ||
      this.getTotalToPay() <= 0
    ) {
      // Se já está selecionado, remove
      this.cartState.removePaymentMethod(paymentMethod.id);
    } else {
      // Se não está selecionado, adiciona com valor inicial
      const paymentMethodWithValue = {
        ...paymentMethod,
        value: this.getRemainingAmount(),
      };
      this.cartState.addPaymentMethod(paymentMethodWithValue);
    }
  }

  onPaymentValueChange(paymentMethodId: string, value: number) {
    this.cartState.updatePaymentMethodValue(paymentMethodId, value);
  }

  onPaymentValueBlur(paymentMethodId: string) {
    if (this.getTotalToPay() < this.getRemainingAmount()) {
      this.cartState.updatePaymentMethodValue(
        paymentMethodId,
        this.getRemainingAmount()
      );
    }
  }

  getPaymentMethodValue(paymentMethodId: string): number {
    const paymentMethod = this.cartState
      .paymentMethods()
      .find(pm => pm.id === paymentMethodId);
    return paymentMethod?.value || 0;
  }

  // Calcula o total pago considerando os valores dos métodos de pagamento
  getTotalPaid(): number {
    return this.cartState
      .paymentMethods()
      .reduce((sum, pm) => sum + (pm.value || 0), 0);
  }

  // Calcula o valor restante a pagar considerando os métodos de pagamento
  getRemainingAmount(): number {
    const total = this.cartState.total();
    const paidAmount = this.getTotalPaid();
    return Math.max(0, total - paidAmount);
  }

  // Calcula o total a pagar considerando os descontos
  getTotalToPay(): number {
    return this.cartState.total() - this.getTotalPaid();
  }

  isPaymentMethodSelected(paymentMethodId: string): boolean {
    return this.cartState.isPaymentMethodSelected(paymentMethodId);
  }
}
