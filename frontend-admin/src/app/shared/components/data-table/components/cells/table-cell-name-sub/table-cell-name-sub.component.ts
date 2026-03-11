import { Component, input } from '@angular/core';
import type { TableColumnNameSub } from '../../../interfaces/data-table.interfaces';

@Component({
  selector: 'fuse-table-cell-name-sub',
  imports: [],
  templateUrl: './table-cell-name-sub.component.html',
  styleUrl: './table-cell-name-sub.component.css',
})
export class TableCellNameSubComponent {
  readonly column = input.required<TableColumnNameSub>();
  readonly row = input.required<Record<string, unknown>>();
}
