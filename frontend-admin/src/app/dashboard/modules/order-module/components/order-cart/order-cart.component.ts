import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CurrencyPipe, NgClass } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { sleep } from 'app/shared/utils/utils';
import { CartItem, CartState } from './order-cart.state';
import { ClientSelectionComponent } from '../client-selection/client-selection.component';
import { StepperModule } from 'primeng/stepper';
import { DeliverySelectionComponent } from '../delivery-selection/delivery-selection.component';
import { DialogModule } from 'primeng/dialog';
import { PaymentSelectionComponent } from '../payment-selection/payment-selection.component';

@Component({
  selector: 'fuse-order-cart',
  templateUrl: './order-cart.component.html',
  styleUrls: ['./order-cart.component.scss'],
  imports: [
    ButtonModule,
    CurrencyPipe,
    NgClass,
    NgIcon,
    ClientSelectionComponent,
    DeliverySelectionComponent,
    PaymentSelectionComponent,
    StepperModule,
    DialogModule,
  ],
})
export class OrderCartComponent implements OnInit {
  cartState = inject(CartState);
  private cdr = inject(ChangeDetectorRef);

  // Mapeia os itens que estão sendo removidos
  removingItems: Record<string | number, boolean> = {};

  showCheckout = false;

  constructor() {}

  ngOnInit() {}

  getCartData() {}

  async removeItem(item: number | string) {
    if (this.removingItems) this.removingItems[item] = true;
    this.cdr?.detectChanges();

    await sleep(200); // Simula um atraso para a animação de remoção
    this.cartState?.removeItem?.(item);
    if (this.removingItems) delete this.removingItems[item];
  }

  async plusItemQuantity(item: CartItem) {
    item.loading = true;
    await sleep(500);
    item.loading = false;
    this.cartState?.updateItemQuantity?.(item?.id, 1, true);
  }

  async minusItemQuantity(item: CartItem) {
    if (item?.quantity === 1) {
      if (this.removingItems) this.removingItems[item.id] = true;
      this.cdr?.detectChanges();
      await sleep(200); // Simula um atraso para a animação de remoção
      this.cartState?.updateItemQuantity?.(item?.id, -1, true);
      if (this.removingItems) delete this.removingItems[item.id];
    } else {
      item.loading = true;
      await sleep(500);
      item.loading = false;
      this.cartState?.updateItemQuantity?.(item?.id, -1, true);
    }
  }

  checkout() {
    const cart = this.cartState.getCartData();
    const data = {
      clientId: 1,
      total: 0,
      items: cart.cartItems.map((item: CartItem) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.finalPrice,
      })),
      payments: cart.paymentMethods.map((payment: any) => ({
        typeId: payment.method,
        amount: payment.amount,
      })),
    };
    this.cartState.checkout(data);
  }
}
