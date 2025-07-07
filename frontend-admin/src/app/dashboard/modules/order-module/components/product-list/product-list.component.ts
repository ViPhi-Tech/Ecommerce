import { Component, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ProductState } from 'app/dashboard/modules/product-module/product.state';
import { CartState } from '../order-cart/order-cart.state';
import { ProductSearchComponent } from './components/product-search/product-search.component';
import { FormModule } from "../../../../../shared/components/form/form.module";

@Component({
  selector: 'fuse-product-list',
  templateUrl: './product-list.component.html',
  imports: [ButtonModule, SelectModule, ReactiveFormsModule, CurrencyPipe, ProductSearchComponent, FormModule, ReactiveFormsModule]
})
export class ProductListComponent implements OnInit {
  private toast = inject(MessageService);

  productState = inject(ProductState);
  private cartState = inject(CartState);

  filterSelected = new FormControl('all');

  filters = signal([
    { label: 'Todos', value: 'all' },
    { label: 'Maior Preço', value: 'high-price' },
    { label: 'Menor Preço', value: 'low-price' },
    { label: 'A-Z', value: 'az' },
    { label: 'Z-A', value: 'za' },
  ])

  constructor() {}

  async ngOnInit() {
    await this.productState.getProductList();
    console.log(this.productState.productList());
  }

  async addProductToCart(product: any) {
    product.loading = true;

    // await sleep(1000); // Simulating a delay for adding the product to the cart
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
