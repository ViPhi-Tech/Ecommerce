import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ProductState } from 'app/dashboard/modules/product-module/product.state';
import { FormModule } from "../form/form.module";
import { FormControl } from '@angular/forms';
import { Product } from 'app/shared/interfaces/product-module.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'fuse-search-product',
  templateUrl: './search-product.component.html',
  imports: [FormModule, CurrencyPipe],
})
export class SearchProductComponent implements OnInit {
  private productState = inject(ProductState);
  private destroyRef = inject(DestroyRef);

  searchControl = new FormControl('');

  products = signal<Product[]>([]);

  constructor() {}

  ngOnInit() {
    this.productState.getProductList();

    this.searchControl
      .valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((products) => {
        console.log('Search value changed:', products);
        if (!this.searchControl.value) {
          this.products.set([]); // Clear the product list if search value is empty
          return;
        }
        this.products.set(this.productState.productList())
      });
  }

  selectProduct(product: Product) {
    this.searchControl.setValue(product.name);
    this.products.set([]); // Clear the product list after selection
  }

  onSearchBlur() {
    this.searchControl.setValue(''); // Clear the search input on blur
  }
}
