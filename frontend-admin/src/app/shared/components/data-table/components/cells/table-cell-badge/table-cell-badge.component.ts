import { Component, effect, input, signal } from '@angular/core';
import type { TableColumnBadge } from '../../../interfaces/data-table.interfaces';

@Component({
  selector: 'fuse-table-cell-badge',
  imports: [],
  templateUrl: './table-cell-badge.component.html',
  styleUrl: './table-cell-badge.component.css',
})
export class TableCellBadgeComponent {
  readonly column = input.required<TableColumnBadge>();
  readonly row = input.required<Record<string, unknown>>();
  readonly classMap = input<Record<string, string>>();
  readonly labelMap = input<Record<string, string>>();

  readonly label = signal<string>('');

  constructor() {
    effect(() => {
      if (this.labelMap()) {
        this.label.set(this.labelMap()?.[this.row()[this.column().labelKey] as string] ?? '');
      } else {
        this.label.set(this.row()[this.column().labelKey] as string);
      }
    });
  }

  get dotClass(): string {
    const map = this.classMap();
    const dotKey = this.column().dotKey;
    const rawStatus = dotKey ? (this.row()[dotKey] as string | undefined) : undefined;

    const base = 'size-1.5 rounded-full ';

    if (map && rawStatus && map[rawStatus]) {
      return base + map[rawStatus];
    }

    // Classe default caso não exista mapeamento para o status atual
    return base + 'bg-slate-300';
  }
}
