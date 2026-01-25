import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  ViewChild,
  TemplateRef,
  AfterViewInit,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CoreService } from 'app/shared/services/core.service';
import { TableConfig } from 'app/shared/interfaces/table.interfaces';
import { ConfirmationService, MessageService } from 'primeng/api';
import { StockMovementService } from '../../stock-movement.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { heightAnimation } from 'app/shared/utils/animations';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { StockMovementState } from '../../stock-movement.state';
import SimpleIndicatorComponent from 'app/shared/components/simple-indicator/simple-indicator.component';
import { MovementItemComponent } from '../../components/movement-item/movement-item.component';
import { FormModule } from 'app/shared/components/form/form.module';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { TableComponent } from 'app/shared/components/table/table.component';
import dayjs from 'dayjs';

@Component({
  selector: 'fuse-stock-movement-list',
  templateUrl: './stock-movement-list.component.html',
  styleUrls: ['./stock-movement-list.component.scss'],
  animations: [heightAnimation],
  imports: [
    ButtonModule,
    BadgeModule,
    SimpleIndicatorComponent,
    MovementItemComponent,
    FormModule,
    ReactiveFormsModule,
    NgIcon,
    TableComponent,
  ],
})
export class StockMovementListComponent implements OnInit, AfterViewInit {
  @ViewChild('typeTemplate') typeTemplate!: TemplateRef<any>;
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private coreService = inject(CoreService);
  private toast = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private stockMovementService = inject(StockMovementService);
  private destroyedRef = inject(DestroyRef);

  state = inject(StockMovementState);

  productId: string | null = null;
  activeViewMode: 'cards' | 'table' = 'cards';

  tableConfig = signal<TableConfig>({
    rowsPerPageOptions: [5, 10, 20],
    rowsPerPage: 10,
    paginator: true,
    pageLinkSize: 5,
    refresh: () => this.refreshStockMovements(),
    columns: [
      {
        field: 'date',
        caption: 'Data',
        sortable: true,
      },
      {
        field: 'productName',
        caption: 'Produto',
        sortable: true,
        filter: true,
      },
      { field: 'productSku', caption: 'SKU', sortable: true, filter: true },
      {
        field: 'type',
        caption: 'Tipo',
        sortable: true,
        filter: true,
        template: this.typeTemplate,
        align: 'center',
      },
      {
        field: 'quantity',
        caption: 'Quantidade',
        sortable: true,
        filter: true,
      },
      {
        field: 'previousStock',
        caption: 'Estoque Anterior',
        sortable: true,
        filter: true,
      },
      {
        field: 'currentStock',
        caption: 'Estoque Atual',
        sortable: true,
        filter: true,
      },
      { field: 'reason', caption: 'Motivo', sortable: true, filter: true },
      {
        field: 'createdAt',
        caption: 'Data',
        type: 'date',
        sortable: true,
        filter: true,
      },
      {
        field: 'createdBy',
        caption: 'Criado Por',
        sortable: true,
        filter: true,
      },
    ],
    headerButtons: [
      {
        icon: 'pi pi-plus',
        label: 'Adicionar',
        tooltip: 'Adicionar Movimento de Estoque',
        action: () => {
          this.router.navigate(['dashboard/config/stock-movements/new']);
        },
      },
    ],
  });

  title = '';

  maxDate = signal(new Date());
  movementTypes = signal([
    { label: 'Todos', value: '' },
    { label: 'Entrada', value: 'IN' },
    { label: 'Saída', value: 'OUT' },
  ]);

  formFilter = this.formBuilder.group({
    type: [''],
    date: [dayjs().format('DD/MM/YYYY')],
  });

  constructor() {}

  ngOnInit() {
    // Verifica se está visualizando movimentos de um produto específico
    this.productId = this.route.snapshot.paramMap.get('productId');

    this.stockMovementService.refreshStock$
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe(() => {
        this.loadStockMovements();
        this.state.getStockMetrics();
      });

    this.loadStockMovements();
    this.state.getStockMetrics();

    this.formFilter.valueChanges
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe(() => {
        this.onFilterChange();
      });
  }

  ngAfterViewInit() {
    // Atualiza a configuração da tabela com o template após a view estar inicializada
    this.tableConfig.update(config => ({
      ...config,
      columns: config.columns.map(col =>
        col.field === 'type' ? { ...col, template: this.typeTemplate } : col
      ),
    }));
  }

  onFilterChange() {
    this.loadStockMovements();
  }

  refreshStockMovements() {
    this.loadStockMovements();
    this.state.getStockMetrics();
  }

  private loadStockMovements() {
    const filter: any = this.formFilter.getRawValue();
    filter.date = dayjs(filter.date, 'DD/MM/YYYY').format('YYYY-MM-DD');
    this.state.getStockMovementList(filter);
  }

  deleteStockMovement(stockMovementId: string) {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja excluir este movimento de estoque?',
      header: 'Confirmação de Exclusão',
      icon: 'pi pi-exclamation-triangle text-red-500',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.stockMovementService
          .deleteStockMovement(stockMovementId)
          .pipe(takeUntilDestroyed(this.destroyedRef))
          .subscribe({
            next: () => {
              this.toast.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Movimento de estoque excluído com sucesso',
              });
              this.loadStockMovements();
            },
            error: () => {
              this.toast.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao excluir movimento de estoque',
              });
            },
          });
      },
    });
  }

  newInbound() {
    this.router.navigate([{ outlets: { drawer: ['inbound', 'new'] } }]);
  }

  newOutbound() {
    this.router.navigate([{ outlets: { drawer: ['outbound', 'new'] } }]);
  }

  setViewMode(mode: 'cards' | 'table') {
    this.activeViewMode = mode;
  }

  openImportModal() {
    this.router.navigate([{ outlets: { drawer: ['import-nfe'] } }]);
  }
}
