import { Component, inject, input } from '@angular/core';
import { CategoryState } from 'app/dashboard/modules/category-module/category.state';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'fuse-product-import-list',
  templateUrl: './product-import-list.component.html',
  standalone: true,
  imports: [TableModule],
})
export class ProductImportListComponent {
  private categoryState = inject(CategoryState);

  products = input<any[]>([]);

  constructor() {}

  isCategoryValid(categoryId: number): boolean {
    const categories = this.categoryState.categoryList();
    return categories.some((cat: any) => cat.id === categoryId);
  }
}
