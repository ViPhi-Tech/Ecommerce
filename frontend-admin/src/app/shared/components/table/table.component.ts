import { Component, computed, input, InputSignal, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TABLE_CONFIG } from '../../constants/table.constants';
import { TableConfig } from '../../interfaces/table.interfaces';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import {
  CurrencyPipe,
  NgClass,
  NgStyle,
  NgTemplateOutlet,
} from '@angular/common';
import { TableActionsComponent } from './components/table-actions/table-actions.component';
import { TooltipModule } from 'primeng/tooltip';
import { NgIcon } from '@ng-icons/core';
import { DocumentPipe } from 'app/shared/pipes/document.pipe';
import { DateCustomPipe } from 'app/shared/pipes/date.pipe';
import { PhonePipe } from 'app/shared/pipes/phone.pipe';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import dayjs from 'dayjs';

@Component({
  selector: 'fuse-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  imports: [
    RouterModule,
    SkeletonModule,
    TableModule,
    TableActionsComponent,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ButtonModule,
    NgStyle,
    NgTemplateOutlet,
    TooltipModule,
    CurrencyPipe,
    NgIcon,
    NgClass,
    DocumentPipe,
    PhonePipe,
    DateCustomPipe,
    MultiSelectModule,
    SelectModule,
    FormsModule,

  ],
})
export class TableComponent implements OnInit {
  constructor() { }

  title: InputSignal<string> = input('');
  data: InputSignal<any> = input([]);
  loading = input(false);
  config: InputSignal<TableConfig> = input(TABLE_CONFIG, {
    transform: (value: TableConfig) => {
      if (value) {
        return { ...TABLE_CONFIG, ...value };
      }
      return TABLE_CONFIG;
    },
  });

  // Campos de filtro
  globalFilterFields = computed(() => {
    let fields: string[] = [];
    if (this.data()?.length) {
      fields = this.data()?.length > 0 ? Object.keys(this.data()?.[0]) : [];
    }
    return fields;
  });

  columnData = computed(() => {
    const data: any = {};
    this.config().columns.map(col => {
      if (col.filter) {
        const uniqueValues = Array.from(
          new Set(this.data()?.map((item: any) => item[col.field]))
        );
        data[col.field] = uniqueValues.map((value: any) => {
          let label = value;
          label = this.formatLabelFilter(value, col?.type || 'text');
          return {
            label: label,
            value: value,
          };
        });
      }
    });
    return data;
  })

  exportColumns = computed(() => {
    return this.config().columns.map(col => {
      return {
        title: col.caption,
        dataKey: col.field,
        type: col.type || 'text',
        headerAlign: col.headerAlign || 'left',
      };
    });
  });
  ngOnInit() { }

  search($event: any, dt2: any) {
    dt2.filterGlobal($event?.target?.value, 'contains');
  }

  clearFilters(dt2: any) {
    dt2.clear();
  }

  exportTable(dt2: any) {
    dt2?.exportCSV();
  }

  onRowClick(rowData: any, rowIndex: number) {
    const config = this.config();
    if (config && typeof config.rowClick === 'function') {
      config.rowClick(rowData, rowIndex);
    }
  }

  formatLabelFilter(value: any, type: string): string {
    let label = value;
    if (type === 'date') {
      label = dayjs(value).format('DD/MM/YYYY');
    }
    if (type === 'datetime') {
      label = dayjs(value).format('DD/MM/YYYY HH:mm');
    }
    if (type === 'currency') {
      label = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value);
    }
    return label;
  }
}
