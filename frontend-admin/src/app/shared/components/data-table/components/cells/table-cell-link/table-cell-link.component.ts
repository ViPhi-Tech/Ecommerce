import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { TableColumnLink } from '../../../interfaces/data-table.interfaces';

@Component({
  selector: 'fuse-table-cell-link',
  imports: [RouterLink],
  templateUrl: './table-cell-link.component.html',
  styleUrl: './table-cell-link.component.css',
})
export class TableCellLinkComponent {
  readonly column = input.required<TableColumnLink>();
  readonly row = input.required<Record<string, unknown>>();
}
