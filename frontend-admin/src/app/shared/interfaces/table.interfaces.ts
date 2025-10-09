import { TemplateRef } from '@angular/core';
import { ButtonSeverityType } from '../types/button.types';

export interface TableConfig {
  rowsPerPageOptions?: number[];
  rowsPerPage?: number;
  paginator?: boolean;
  pageLinkSize: number;
  showHeader?: boolean;
  showClearFilters?: boolean;
  showExport?: boolean;
  showCurrentPageReport?: boolean;
  emptyMessage?: string;
  textWrap?: boolean;
  selection?: {
    mode: 'single' | 'multiple';
  };
  columns: TableColumn[];
  headerButtons?: HeaderButton[];
  rowClick?: (rowData: any, rowIndex: number) => void;
}

export interface TableColumn {
  field: string;
  type?: string;
  caption: string;
  sortable?: boolean;
  filter?: boolean;
  multiFilter?: boolean; // Indicates if the column supports multiple filters
  customClass?: string;
  width?: string; // Maximum width of the column
  actionButtonsType?: 'buttons' | 'dropdown'; // Type of action buttons, can be 'buttons' or 'dropdown'
  actionButtons?: ActionButtons[];
  template?: TemplateRef<any | null>;
  headerAlign?: 'left' | 'center' | 'right'; // Alignment of the header
  align?: 'left' | 'center' | 'right'; // Alignment of the column
  style?: string;
  badgeSeverityKey?: string; // Key for badge severity, used for status badges
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
  label?: string; // Optional label for the button
  icon?: string;
  variant?: 'text' | 'outlined' | 'filled'; // e.g., "text", "outlined", "filled"
  iconType?: string; // e.g., "material", "font-awesome"
  color?: string; // e.g., "primary", "accent", "warn"
  colorText?: string; // Custom text color
  colorIcon?: string; // Custom icon color
  tooltip: string;
  show?: (rowData: any) => boolean;
  action: (rowData: any, rowIndex?: number | string) => void;
}

export type columnType =
  | 'text'
  | 'number'
  | 'date'
  | 'boolean'
  | 'phone'
  | 'cnpj'
  | 'cpf'
  | 'email'
  | 'actions';

export const DEFAULT_TABLE_CONFIG: TableConfig = {
  rowsPerPageOptions: [10, 20, 50],
  rowsPerPage: 10,
  paginator: true,
  pageLinkSize: 5,
  textWrap: false,
  showCurrentPageReport: true,
  emptyMessage: 'Nenhum registro encontrado',
  columns: [],
  headerButtons: [],
};
