import {
  Component,
  computed,
  input,
  InputSignal,
  model,
  OnInit,
  inject,
} from '@angular/core';
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
  DecimalPipe,
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
import { BadgeModule } from 'primeng/badge';
import { ExcelExportService } from '../../services/excel-export.service';
import { MessageService } from 'primeng/api';

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
    NgClass,
    NgStyle,
    NgTemplateOutlet,
    TooltipModule,
    CurrencyPipe,
    DecimalPipe,
    NgIcon,
    DocumentPipe,
    PhonePipe,
    DateCustomPipe,
    MultiSelectModule,
    SelectModule,
    FormsModule,
    BadgeModule,
  ],
})
export class TableComponent implements OnInit {
  private excelExportService = inject(ExcelExportService);
  private messageService = inject(MessageService);

  constructor() {}

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

  selectedData = model<any>([]);

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
  });

  exportColumns = computed(() => {
    const columns = this.config()
      .columns.map(col => {
        return {
          title: col.caption,
          dataKey: col.field,
          type: col.type || 'text',
          headerAlign: col.headerAlign || 'left',
        };
      })
      .filter(col => col.dataKey !== 'actions' || col.title !== 'Ações');

    return columns;
  });
  ngOnInit() {}

  private sortExportData(
    rows: any[],
    field: string,
    order: 'asc' | 'desc'
  ): any[] {
    const dir = order === 'asc' ? 1 : -1;
    return rows.sort((a, b) => {
      const va = a?.[field];
      const vb = b?.[field];
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      const na = typeof va === 'number' ? va : NaN;
      const nb = typeof vb === 'number' ? vb : NaN;
      if (!Number.isNaN(na) && !Number.isNaN(nb)) {
        return (na - nb) * dir;
      }
      const da = dayjs(va);
      const db = dayjs(vb);
      if (da.isValid() && db.isValid()) {
        return (da.valueOf() - db.valueOf()) * dir;
      }
      return String(va).localeCompare(String(vb), 'pt-BR') * dir;
    });
  }

  search($event: any, dt2: any) {
    dt2.filterGlobal($event?.target?.value, 'contains');
  }

  clearFilters(dt2: any) {
    dt2.clear();
  }

  exportTable() {
    const columns = this.exportColumns();
    let data = this.data();
    const sortCfg = this.config().exportSort;
    if (sortCfg?.field && data?.length) {
      data = this.sortExportData(
        [...data],
        sortCfg.field,
        sortCfg.order ?? 'asc'
      );
    }

    if (!data || data.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Não há dados para exportar',
      });
      return;
    }

    const fileName = this.title() || 'dados';
    void this.excelExportService
      .exportToExcel(data, columns, fileName)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Excel exportado com sucesso!',
        });
      })
      .catch(error => {
        console.error('Erro ao exportar Excel:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao exportar dados para Excel',
        });
      });
  }

  onRowClick(rowData: any, rowIndex: number) {
    const config = this.config();
    if (config && typeof config.rowClick === 'function') {
      config.rowClick(rowData, rowIndex);
    }
  }

  refreshData() {
    const config = this.config();
    if (config && typeof config.refresh === 'function') {
      config.refresh();
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

  /**
   * Retorna largura do skeleton por coluna para um loading mais natural
   */
  getSkeletonWidth(col: { field?: string; type?: string }): string {
    if (col?.field === 'actions') return '4rem';
    switch (col?.type) {
      case 'date':
      case 'datetime':
        return '75%';
      case 'currency':
      case 'percent':
        return '55%';
      case 'badge':
        return '45%';
      default:
        return '85%';
    }
  }
}
