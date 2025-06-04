import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CurrencyPipe, NgClass } from '@angular/common';
import { CartItem, CartStore } from 'app/shared/store/cart.state';
import { NgIcon } from '@ng-icons/core';
import { sleep } from 'app/shared/utils/utils';

@Component({
  selector: 'fuse-order-cart',
  templateUrl: './order-cart.component.html',
  styleUrls: ['./order-cart.component.scss'],
  imports: [ButtonModule, CurrencyPipe, NgClass, NgIcon],
})
export class OrderCartComponent implements OnInit {
  cartStore = inject(CartStore);
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
    this.cartStore?.removeItem?.(item);
    if (this.removingItems) delete this.removingItems[item];
  }

  async plusItemQuantity(item: CartItem) {
    item.loading = true;
    await sleep(500);
    item.loading = false;
    this.cartStore?.updateItemQuantity?.(item?.id, 1, true);
  }

  async minusItemQuantity(item: CartItem) {
    if (item?.quantity === 1) {
      if (this.removingItems) this.removingItems[item.id] = true;
      this.cdr?.detectChanges();
      await sleep(200); // Simula um atraso para a animação de remoção
      this.cartStore?.updateItemQuantity?.(item?.id, -1, true);
      if (this.removingItems) delete this.removingItems[item.id];
    } else {
      item.loading = true;
      await sleep(500);
      item.loading = false;
      this.cartStore?.updateItemQuantity?.(item?.id, -1, true);
    }
  }

  checkout() {
    const cart = this.cartStore.getCartData();
    console.log('cart', cart);
  }
}
