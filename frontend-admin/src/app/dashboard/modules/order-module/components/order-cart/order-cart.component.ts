import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef,
  signal,
} from '@angular/core';
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
import { ClientState } from 'app/dashboard/modules/client-module/client.state';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

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
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  public toast = inject(MessageService);

  private clientState = inject(ClientState);
  cartState = inject(CartState);

  // Mapeia os itens que estão sendo removidos
  removingItems: Record<string | number, boolean> = {};

  finishing = signal(false);

  showCheckout = false;
  step = 1;

  constructor() {}

  ngOnInit() {
  }

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

  showOrderCheckout() {
    this.showCheckout = true;
    this.cartState.clearPaymentMethods();
    this.cartState.clearDeliveryType();
    this.cartState.clearClient();
  }

  onClientSelected() {
    this.step = 2; // Avança para o próximo passo
    this.cdr.detectChanges();
  }
  onDeliverySelected() {
    this.step = 3; // Avança para o próximo passo
    this.cdr.detectChanges();
  }

  async checkout() {
    const cart = this.cartState.getCartData();
    const data = {
      clientId: cart.client?.id,
      total: cart.total,
      items: cart.cartItems.map((item: CartItem) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.finalPrice,
      })),
      payments: cart.paymentMethods.map((payment: any) => ({
        typeId: payment.id,
        value: payment.value,
      })),
    };
    const response = await this.cartState.checkout(data);
    if (response) {
      this.router.navigate(['/dashboard/orders']);
      this.toast.add({
        severity: 'success',
        summary: 'Pedido realizado com sucesso',
        detail: `Pedido #${response.data.id} realizado com sucesso!`,
        life: 3000,
      });
    }
  }
}
