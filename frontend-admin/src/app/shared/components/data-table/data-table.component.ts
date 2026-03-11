import { Component, computed, effect, input, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { TableColumn, TablePagination } from './interfaces/data-table.interfaces';
import { TableCellAvatarComponent } from './components/cells/table-cell-avatar/table-cell-avatar.component';
import { TableCellNameSubComponent } from './components/cells/table-cell-name-sub/table-cell-name-sub.component';
import { TableCellBadgeComponent } from './components/cells/table-cell-badge/table-cell-badge.component';
import { TableCellProgressComponent } from './components/cells/table-cell-progress/table-cell-progress.component';
import { TableCellLinkComponent } from './components/cells/table-cell-link/table-cell-link.component';
import { TableCellTextComponent } from './components/cells/table-cell-text/table-cell-text.component';
import { TableCellActionsComponent } from './components/cells/table-cell-actions/table-cell-actions.component';
import { TablePaginationComponent } from './components/table-pagination/table-pagination.component';

const DEFAULT_PAGE_SIZE_OPTIONS = [5, 10, 20] as const;

@Component({
  selector: 'fuse-data-table',
  imports: [
    NgIcon,
    TableCellAvatarComponent,
    TableCellNameSubComponent,
    TableCellBadgeComponent,
    TableCellProgressComponent,
    TableCellLinkComponent,
    TableCellTextComponent,
    TableCellActionsComponent,
    TablePaginationComponent,
  ],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css',
})
export class DataTableComponent {
  readonly columns = input.required<TableColumn[]>();
  readonly data = input.required<Record<string, unknown>[]>();
  readonly trackByKey = input<string>('id');
  readonly emptyMessage = input<string>('Nenhum registro encontrado.');
  /** Rótulo para o contador (ex.: "cargos", "colaboradores"). */
  readonly countLabel = input<string>('itens');
  /** Opções de itens por página (ex.: [5, 10, 20]). Se não informado, usa [5, 10, 20]. */
  readonly pageSizeOptions = input<readonly number[]>(DEFAULT_PAGE_SIZE_OPTIONS);
  /** Stagger delay in seconds for row enter animation (e.g. 0.04 = 40ms between rows). */
  readonly rowStaggerSeconds = input<number>(0.04);

  protected readonly page = signal(1);
  protected readonly pageSize = signal(5);
  /** Coluna atual da ordenação (key) ou null se sem ordenação. */
  protected readonly sortColumnKey = signal<string | null>(null);
  /** Direção da ordenação. */
  protected readonly sortDirection = signal<'asc' | 'desc'>('asc');

  constructor() {
    effect(() => {
      this.data();
      this.page.set(1);
    });
  }

  protected readonly total = computed(() => this.data().length);

  protected readonly sortedData = computed(() => {
    const all = [...this.data()];
    const key = this.sortColumnKey();
    const dir = this.sortDirection();
    if (!key) return all;
    return all.sort((a, b) => {
      const va = a[key];
      const vb = b[key];
      const cmp = compareValues(va, vb);
      return dir === 'asc' ? cmp : -cmp;
    });
  });

  protected readonly paginatedData = computed(() => {
    const all = this.sortedData();
    const page = this.page();
    const size = this.pageSize();
    const start = (page - 1) * size;
    return all.slice(start, start + size);
  });

  protected onSortColumn(col: TableColumn): void {
    if (!col.sortable) return;
    const current = this.sortColumnKey();
    if (current === col.key) {
      this.sortDirection.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortColumnKey.set(col.key);
      this.sortDirection.set('asc');
    }
    this.page.set(1);
  }

  protected getSortIcon(col: TableColumn): string | null {
    if (!col.sortable) return null;
    if (this.sortColumnKey() !== col.key) return 'lucideArrowUpDown';
    return this.sortDirection() === 'asc' ? 'lucideArrowUp' : 'lucideArrowDown';
  }

  protected readonly pagination = computed<TablePagination>(() => {
    const total = this.total();
    const pageSize = this.pageSize();
    const currentPage = this.page();
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (currentPage - 1) * pageSize;
    const showingFrom = total === 0 ? 0 : start + 1;
    const showingTo = Math.min(start + pageSize, total);
    return {
      showingFrom,
      showingTo,
      total,
      countLabel: this.countLabel(),
      currentPage,
      totalPages,
      pages: Array.from({ length: totalPages }, (_, i) => i + 1),
      previousLabel: 'Anterior',
      nextLabel: 'Próximo',
      pageSize,
      pageSizeOptions: this.pageSizeOptions(),
    };
  });

  protected onPageChange(page: number): void {
    const totalPages = this.pagination().totalPages;
    this.page.set(Math.max(1, Math.min(page, totalPages)));
  }

  protected onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.page.set(1);
  }

  /** Calcula o delay em milissegundos para a animação CSS da linha. */
  getRowAnimationDelay(index: number): number {
    return index * this.rowStaggerSeconds() * 1000;
  }
}

function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  const sa = String(a);
  const sb = String(b);
  return sa.localeCompare(sb, undefined, { numeric: true });
}
