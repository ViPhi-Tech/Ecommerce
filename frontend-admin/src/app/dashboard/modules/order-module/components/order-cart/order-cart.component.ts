import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CurrencyPipe, NgClass } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { sleep } from 'app/shared/utils/utils';
import { CartItem, CartState } from './order-cart.state';

@Component({
  selector: 'fuse-order-cart',
  templateUrl: './order-cart.component.html',
  styleUrls: ['./order-cart.component.scss'],
  imports: [ButtonModule, CurrencyPipe, NgClass, NgIcon],
})
export class OrderCartComponent implements OnInit {
  cartState = inject(CartState);
  private cdr = inject(ChangeDetectorRef);

  // Mapeia os itens que estão sendo removidos
  removingItems: Record<string | number, boolean> = {};

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
    console.log('cart', cart);
  }
}
