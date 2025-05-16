import { TemplateRef } from '@angular/core';
import { ButtonSeverityType } from '../types/button.types';

export interface TableConfig {
  rowsPerPageOptions?: number[];
  rowsPerPage?: number;
  paginator?: boolean;
  pageLinkSize: number;
  showCurrentPageReport?: boolean;
  emptyMessage?: string;
  columns: TableColumn[];
  headerButtons?: HeaderButton[];
}

export interface TableColumn {
  field: string | number;
  type?: string;
  caption: string;
  sortable?: boolean;
  filter?: boolean;
  customClass?: string;
  actionButtons?: ActionButtons[];
  template?: TemplateRef<any | null>;
}

export interface HeaderButton {
  label?: string;
  tooltip?: string;
  icon?: string;
  class?: string;
  styleClass?: string;
  visible?: boolean;
  outline?: boolean;
  link?: unknown[] | string;
  color?: ButtonSeverityType; // e.g., "success", "info", "warning", "danger"
  action: () => void;
}

export interface ActionButtons {
  icon: string;
  iconType?: string; // e.g., "material", "font-awesome"
  color?: string; // e.g., "primary", "accent", "warn"
  tooltip: string;
  show: (rowData: any) => boolean;
  action: (rowData: any, rowIndex?: number) => void;
}

export const DEFAULT_TABLE_CONFIG: TableConfig = {
  rowsPerPageOptions: [10, 20, 50],
  rowsPerPage: 10,
  paginator: true,
  pageLinkSize: 5,
  showCurrentPageReport: true,
  emptyMessage: 'Nenhum registro encontrado',
  columns: [],
  headerButtons: [],
};
