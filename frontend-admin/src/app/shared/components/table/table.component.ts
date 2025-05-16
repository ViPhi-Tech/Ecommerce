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
  DatePipe,
  NgStyle,
  NgTemplateOutlet,
} from '@angular/common';
import { TableActionsComponent } from './components/table-actions/table-actions.component';
import { TooltipModule } from 'primeng/tooltip';
import { NgIcon } from '@ng-icons/core';

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
    DatePipe,
    CurrencyPipe,
    NgIcon,
  ],
})
export class TableComponent implements OnInit {
  constructor() {}

  title: InputSignal<string> = input('');
  data: InputSignal<any> = input();
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
    if (this.data().length) {
      fields = this.data().length > 0 ? Object.keys(this.data()[0]) : [];
    }
    return fields;
  });

  ngOnInit() {}

  search($event: any, dt2: any) {
    dt2.filterGlobal($event?.target?.value, 'contains');
  }
}
