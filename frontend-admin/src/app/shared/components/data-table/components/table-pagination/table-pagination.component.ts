import { Component, input, output } from '@angular/core';
import type { TablePagination } from '../../interfaces/data-table.interfaces';

@Component({
  selector: 'fuse-table-pagination',
  imports: [],
  templateUrl: './table-pagination.component.html',
  styleUrl: './table-pagination.component.css',
})
export class TablePaginationComponent {
  readonly pagination = input.required<TablePagination>();
  readonly pageChange = output<number>();
  readonly pageSizeChange = output<number>();

  onPageChange(page: number): void {
    this.pageChange.emit(page);
  }

  onPageSizeChange(size: number): void {
    this.pageSizeChange.emit(size);
  }
}
