import { Component, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ProductState } from 'app/dashboard/modules/product-module/product.state';
import { CartState } from '../order-cart/order-cart.state';
import { ProductFilterComponent } from './components/product-filter/product-filter.component';
import { FormModule } from '../../../../../shared/components/form/form.module';
import { NgIcon } from '@ng-icons/core';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
  selector: 'fuse-product-list',
  templateUrl: './product-list.component.html',
  imports: [
    ButtonModule,
    SelectModule,
    ReactiveFormsModule,
    CurrencyPipe,
    ProductFilterComponent,
    FormModule,
    FormsModule,
    SelectButtonModule,
    ReactiveFormsModule,
    NgIcon,
    CommonModule,
  ],
})
export class ProductListComponent implements OnInit {
  private toast = inject(MessageService);

  productState = inject(ProductState);
  private cartState = inject(CartState);

  productView = signal<'list' | 'grid'>('list');

  viewItems = signal([
    { label: 'Lista', value: 'list', icon: 'lucideList' },
    { label: 'Grade', value: 'grid', icon: 'lucideGrid3x3' },
  ]);

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
