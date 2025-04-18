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
  caption: string;
  sortable?: boolean;
  filter?: boolean;
  customClass?: string;
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
  action: () => void;
}
