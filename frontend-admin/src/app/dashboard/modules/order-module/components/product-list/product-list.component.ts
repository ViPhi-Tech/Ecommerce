import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { CartStore } from 'app/shared/store/cart.state';
import { sleep } from 'app/shared/utils/utils';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'fuse-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  imports: [ButtonModule, SelectModule, ReactiveFormsModule, CurrencyPipe],
})
export class ProductListComponent implements OnInit {
  private toast = inject(MessageService);

  private cartStore = inject(CartStore);

  products: any[] | undefined;

  constructor() {}

  ngOnInit() {
    this.products = [
      {
        id: 1,
        name: 'Smartphone Galaxy S23',
        price: 4999.99,
        category: 'Eletrônicos',
        image: '/placeholder.svg?height=200&width=200',
      },
      {
        id: 2,
        name: 'Notebook Dell Inspiron',
        price: 3599.9,
        category: 'Computadores',
        image: '/placeholder.svg?height=200&width=200',
      },
      {
        id: 3,
        name: 'Smart TV 55 polegadas',
        price: 2899.0,
        category: 'Eletrônicos',
        image: '/placeholder.svg?height=200&width=200',
      },
      {
        id: 4,
        name: 'Fone de Ouvido Bluetooth',
        price: 299.9,
        category: 'Acessórios',
        image: '/placeholder.svg?height=200&width=200',
      },
      {
        id: 5,
        name: 'Cafeteira Elétrica',
        price: 189.9,
        category: 'Eletrodomésticos',
        image: '/placeholder.svg?height=200&width=200',
      },
      {
        id: 6,
        name: 'Tênis Esportivo',
        price: 249.9,
        category: 'Calçados',
        image: '/placeholder.svg?height=200&width=200',
      },
      {
        id: 7,
        name: 'Mochila para Notebook',
        price: 159.9,
        category: 'Acessórios',
        image: '/placeholder.svg?height=200&width=200',
      },
      {
        id: 8,
        name: 'Relógio Inteligente',
        price: 599.9,
        category: 'Eletrônicos',
        image: '/placeholder.svg?height=200&width=200',
      },
    ];
  }

  async addProductToCart(product: any) {
    product.loading = true;

    await sleep(1000); // Simulating a delay for adding the product to the cart
    product.loading = false;
    this.cartStore.addItem(product);
    this.toast.add({
      severity: 'success',
      summary: 'Produto adicionado ao carrinho',
      detail: `${product.name} foi adicionado com sucesso!`,
      life: 3000,
    });
  }
}
