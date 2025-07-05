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
  rowClick?: (rowData: any, rowIndex: number) => void;
}

export interface TableColumn {
  field: string | number;
  type?: string;
  caption: string;
  sortable?: boolean;
  filter?: boolean;
  customClass?: string;
  actionButtonsType?: 'buttons' | 'dropdown'; // Type of action buttons, can be 'buttons' or 'dropdown'
  actionButtons?: ActionButtons[];
  template?: TemplateRef<any | null>;
  headerAlign?: 'left' | 'center' | 'right'; // Alignment of the header
  align?: 'left' | 'center' | 'right'; // Alignment of the column
  style?: string; // Custom CSS styles for the column
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
