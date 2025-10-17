import { Component, inject, OnInit, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CartState } from '../order-cart/order-cart.state';
import { MessageService } from 'primeng/api';
import { FormModule } from 'app/shared/components/form/form.module';
import { NgxMaskDirective } from 'ngx-mask';
import { InputTextModule } from 'primeng/inputtext';
import { PAYMENTS_SITEMAP } from 'app/shared/constants/payments.sitemap';

@Component({
  selector: 'fuse-payment-selection',
  templateUrl: './payment-selection.component.html',
  imports: [
    CommonModule,
    NgIcon,
    ButtonModule,
    InputTextModule,
    FormsModule,
    FormModule,
    NgxMaskDirective,
  ],
})
export class PaymentSelectionComponent implements OnInit {
  public toast = inject(MessageService);
  public cartState = inject(CartState);

  // Dados das formas de pagamento
  paymentMethods = signal<any[]>([...Object.values(PAYMENTS_SITEMAP)]);

  constructor() {}

  ngOnInit() {}

  onPaymentMethodChange(paymentMethod: any) {
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
