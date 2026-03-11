import { Component, input } from '@angular/core';
import type { TableColumnText } from '../../../interfaces/data-table.interfaces';

@Component({
  selector: 'fuse-table-cell-text',
  imports: [],
  templateUrl: './table-cell-text.component.html',
  styleUrl: './table-cell-text.component.css',
})
export class TableCellTextComponent {
  readonly column = input.required<TableColumnText>();
  readonly row = input.required<Record<string, unknown>>();
}
