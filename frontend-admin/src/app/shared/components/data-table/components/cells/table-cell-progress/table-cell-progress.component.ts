import { Component, input } from '@angular/core';
import type { TableColumnProgress } from '../../../interfaces/data-table.interfaces';

@Component({
  selector: 'fuse-table-cell-progress',
  imports: [],
  templateUrl: './table-cell-progress.component.html',
  styleUrl: './table-cell-progress.component.css',
})
export class TableCellProgressComponent {
  readonly column = input.required<TableColumnProgress>();
  readonly row = input.required<Record<string, unknown>>();
}
