import { Component, inject, input } from '@angular/core';
import { CategoryState } from 'app/dashboard/modules/category-module/category.state';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'fuse-product-import-list',
  templateUrl: './product-import-list.component.html',
  standalone: true,
  imports: [TableModule, FormsModule, InputTextModule],
})
export class ProductImportListComponent {
  private categoryState = inject(CategoryState);

  products = input<any[]>([]);
  errors = input<any>(null);

  constructor() {}

  isCategoryValid(categoryId: number): boolean {
    const categories = this.categoryState.categoryList();
    return categories.some((cat: any) => cat.id === categoryId);
  }

  isInvalidSKU(sku: string): boolean {
    return this.errors()?.skuExisting?.includes(sku);
  }

  isInvalidEAN(ean: string): boolean {
    return this.errors()?.eanExisting?.includes(ean.toString());
  }
}
