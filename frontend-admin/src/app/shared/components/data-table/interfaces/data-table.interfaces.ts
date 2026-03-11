export type TableColumnType =
  | 'text'
  | 'avatar'
  | 'nameSub'
  | 'badge'
  | 'progress'
  | 'link'
  | 'actions';

export interface TableColumnBase {
  key: string;
  label: string;
  headerClass?: string;
  cellClass?: string;
  align?: 'left' | 'right' | 'center';
  /** Se true, o cabeçalho da coluna fica clicável para ordenar. Default: false. */
  sortable?: boolean;
}

export interface TableColumnText extends TableColumnBase {
  type?: 'text';
}

export interface TableColumnAvatar extends TableColumnBase {
  type: 'avatar';
  nameKey: string;
  subKey: string;
  avatarUrlKey: string;
  avatarAltKey: string;
}

export interface TableColumnNameSub extends TableColumnBase {
  type: 'nameSub';
  nameKey: string;
  subKey: string;
}

export interface TableColumnBadge extends TableColumnBase {
  type: 'badge';
  labelKey: string;
  classKey: string;
  dotKey: string; // key for dot color (e.g. 'sentiment' -> positive/neutral/struggling)
  classMap?: Record<string, string>;
  labelMap?: Record<string, string>;
}

export interface TableColumnProgress extends TableColumnBase {
  type: 'progress';
  valueKey: string;
  suffix?: string; // e.g. '%'
}

export interface TableColumnLink extends TableColumnBase {
  type: 'link';
  routePrefix: string;
  idKey: string;
  linkLabel: string;
}

export interface TableColumnActions extends TableColumnBase {
  type: 'actions';
  actions: TableColumnAction[];
}
export interface TableColumnAction {
  label: string;
  icon: string;
  class: string;
  onClick: (row: unknown) => void;
}

export type TableColumn =
  | TableColumnText
  | TableColumnAvatar
  | TableColumnNameSub
  | TableColumnBadge
  | TableColumnProgress
  | TableColumnLink
  | TableColumnActions;

export interface TablePagination {
  showingFrom: number;
  showingTo: number;
  total: number;
  countLabel: string; // e.g. 'cargos' ou 'colaboradores'
  currentPage: number;
  totalPages: number;
  pages: number[]; // e.g. [1, 2, 3] for page buttons
  previousLabel?: string;
  nextLabel?: string;
  /** Se definido, exibe seletor "Por página" e emite pageSizeChange */
  pageSize?: number;
  pageSizeOptions?: readonly number[];
}
