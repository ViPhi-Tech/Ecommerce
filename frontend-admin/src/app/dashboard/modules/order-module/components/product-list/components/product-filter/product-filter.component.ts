import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SelectChangeEvent, SelectModule } from 'primeng/select';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectComponent } from 'app/shared/components/form/select/select.component';
import { InputTextModule } from 'primeng/inputtext';
import { ProductState } from 'app/dashboard/modules/product-module/product.state';
import { ProductService } from 'app/dashboard/modules/product-module/product.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'fuse-product-filter',
  templateUrl: './product-filter.component.html',
  imports: [
    ButtonModule,
    SelectModule,
    ReactiveFormsModule,
    IconFieldModule,
    InputIconModule,
    SelectComponent,
    InputTextModule,
  ],
})
export class ProductFilterComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  productState = inject(ProductState);
  private productService = inject(ProductService);

  products: any[] | undefined;

  selectedProduct = new FormControl();
  searchTerm = signal('');

  searchControl = new FormControl('');
  filterSelected = new FormControl('');

  filters = signal([
    { label: 'Maior Preço', value: 'high-price' },
    { label: 'Menor Preço', value: 'low-price' },
    { label: 'A-Z', value: 'az' },
    { label: 'Z-A', value: 'za' },
  ]);

  constructor() {}

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .pipe(debounceTime(500))
      .subscribe((value) => {
        this.filterProduct(value || '');
      });
  }

  filterProduct(query: string) {
    if (query) {
      this.productState.searchProducts(query);
    }
  }

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.productState.setSearchTerm(target.value);
  }

  onFilterChange(event: SelectChangeEvent) {
    this.productState.setOrderFilter(event?.value);
  }
}
