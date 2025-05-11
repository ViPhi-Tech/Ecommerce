import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CartStore } from 'app/shared/store/cart.store';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'fuse-order-cart',
  templateUrl: './order-cart.component.html',
  styleUrls: ['./order-cart.component.scss'],
  imports: [ButtonModule, CurrencyPipe],
})
export class OrderCartComponent implements OnInit {
  cartStore = inject(CartStore);

  constructor() {}

  ngOnInit() {}

  getCartData() {}

  removeItem(item: number | string) {
    this.cartStore.removeItem(item);
  }

  plusItemQuantity(item: number | string) {
    this.cartStore.updateItemQuantity(item, 1, true);
  }

  minusItemQuantity(item: number | string) {
    this.cartStore.updateItemQuantity(item, -1, true);
  }

  checkout() {
    const cart = this.cartStore.getCartData();
    console.log('cart', cart);
  }
}
