import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { sleep } from 'app/shared/utils/utils';
import { MessageService } from 'primeng/api';
import { ProductState } from 'app/dashboard/modules/product-module/product.state';
import { CartState } from '../order-cart/order-cart.state';

@Component({
  selector: 'fuse-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  imports: [ButtonModule, SelectModule, ReactiveFormsModule, CurrencyPipe],
})
export class ProductListComponent implements OnInit {
  private toast = inject(MessageService);

  productState = inject(ProductState);
  private cartState = inject(CartState);

  constructor() {}

  async ngOnInit() {
    await this.productState.getProductList();
    console.log(this.productState.productList());
  }

  async addProductToCart(product: any) {
    product.loading = true;

    await sleep(1000); // Simulating a delay for adding the product to the cart
    product.loading = false;
    this.cartState.addItem(product);
    this.toast.add({
      severity: 'success',
      summary: 'Produto adicionado ao carrinho',
      detail: `${product.name} foi adicionado com sucesso!`,
      life: 3000,
    });
  }
}
