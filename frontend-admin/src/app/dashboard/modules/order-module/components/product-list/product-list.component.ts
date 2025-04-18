import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'fuse-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  imports: [ButtonModule, SelectModule, ReactiveFormsModule],
})
export class ProductListComponent implements OnInit {
  products: any[] | undefined;

  constructor() {}

  ngOnInit() {
    this.products = [
      // Mock data for product search
      { name: 'Product 1', description: 'Description 1', price: 200 },
      { name: 'Product 2', description: 'Description 2', price: 300 },
      { name: 'Product 9', description: 'Description 9', price: 1000 },
      { name: 'Product 10', description: 'Description 10', price: 1100 },
    ];
  }
}
