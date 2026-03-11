import { Component, computed, inject, input, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ElementRef } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import type { TableColumnActions } from '../../../interfaces/data-table.interfaces';

@Component({
  selector: 'fuse-table-cell-actions',
  imports: [NgIcon],
  templateUrl: './table-cell-actions.component.html',
  styleUrl: './table-cell-actions.component.css',
})
export class TableCellActionsComponent {
  readonly column = input.required<TableColumnActions>();
  readonly row = input.required<Record<string, unknown>>();

  protected readonly isDropdownOpen = signal<boolean>(false);

  private readonly doc = inject(DOCUMENT);
  private readonly elRef = inject(ElementRef<HTMLElement>);

  protected readonly visibleActions = computed(() => {
    const actions = this.column().actions;
    return actions.slice(0, 3);
  });

  protected readonly hiddenActions = computed(() => {
    const actions = this.column().actions;
    return actions.length > 3 ? actions.slice(3) : [];
  });

  protected readonly hasMoreActions = computed(() => {
    return this.column().actions.length > 3;
  });

  protected toggleDropdown(): void {
    const next = !this.isDropdownOpen();
    this.isDropdownOpen.set(next);
    if (next) {
      setTimeout(() => this.doc.addEventListener('click', this.docClickHandler, true), 0);
    } else {
      this.doc.removeEventListener('click', this.docClickHandler, true);
    }
  }

  protected handleActionClick(action: { onClick: (row: Record<string, unknown>) => void }): void {
    action.onClick(this.row());
    this.closeDropdown();
  }

  private readonly docClickHandler = (e: Event): void => {
    const target = e.target as Node;
    if (this.elRef.nativeElement.contains(target)) return;
    this.closeDropdown();
  };

  private closeDropdown(): void {
    this.isDropdownOpen.set(false);
    this.doc.removeEventListener('click', this.docClickHandler, true);
  }
}
