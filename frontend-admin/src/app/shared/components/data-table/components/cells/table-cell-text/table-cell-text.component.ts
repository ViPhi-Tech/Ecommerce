import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { DateCustomPipe } from 'app/shared/pipes/date.pipe';
import { DocumentPipe } from 'app/shared/pipes/document.pipe';
import { PhonePipe } from 'app/shared/pipes/phone.pipe';
import type { TableColumnText } from '../../../interfaces/data-table.interfaces';

@Component({
  selector: 'fuse-table-cell-text',
  imports: [CurrencyPipe, DecimalPipe, DateCustomPipe, PhonePipe, DocumentPipe, NgIcon],
  templateUrl: './table-cell-text.component.html',
  styleUrl: './table-cell-text.component.css',
})
export class TableCellTextComponent {
  readonly column = input.required<TableColumnText>();
  readonly row = input.required<Record<string, any>>();
}
