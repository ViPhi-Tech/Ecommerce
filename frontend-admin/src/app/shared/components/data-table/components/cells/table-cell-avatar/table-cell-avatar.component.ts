import { Component, input } from '@angular/core';
import type { TableColumnAvatar } from '../../../interfaces/data-table.interfaces';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'fuse-table-cell-avatar',
  imports: [NgIcon],
  templateUrl: './table-cell-avatar.component.html',
  styleUrl: './table-cell-avatar.component.css',
})
export class TableCellAvatarComponent {
  readonly column = input.required<TableColumnAvatar>();
  readonly row = input.required<Record<string, unknown>>();
}
