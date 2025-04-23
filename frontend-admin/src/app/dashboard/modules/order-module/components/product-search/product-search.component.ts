import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { CurrencyPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CartStore } from '../../../../../shared/store/cart.store';

@Component({
  selector: 'fuse-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss'],
  imports: [ButtonModule, SelectModule, CurrencyPipe, ReactiveFormsModule],
})
export class ProductSearchComponent implements OnInit {
  private cartStore = inject(CartStore);
  products: any[] | undefined;

  selectedProduct = new FormControl();

  constructor() {}

  ngOnInit() {
    this.products = [
      // Mock data for product search
      {
        id: 1,
        name: 'Product 1',
        description: 'Description 1',
        price: 200,
        discountPercent: 10,
      },
      {
        id: 2,
        name: 'Product 2',
        description: 'Description 2',
        price: 300,
        discountPercent: 20,
      },
      {
        id: 3,
        name: 'Product 3',
        description: 'Description 3',
        price: 400,
        discountPercent: 30,
      },
      { id: 4, name: 'Product 4', description: 'Description 4', price: 500 },
      { id: 5, name: 'Product 5', description: 'Description 5', price: 600 },
      { id: 6, name: 'Product 6', description: 'Description 6', price: 700 },
      { id: 7, name: 'Product 7', description: 'Description 7', price: 800 },
      { id: 8, name: 'Product 8', description: 'Description 8', price: 900 },
      { id: 9, name: 'Product 9', description: 'Description 9', price: 1000 },
      {
        id: 10,
        name: 'Product 10',
        description: 'Description 10',
        price: 1100,
      },
    ];
  }
}
