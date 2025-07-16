import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CoreService } from 'app/shared/services/core.service';
import { TableConfig } from 'app/shared/interfaces/table.interfaces';
import { ConfirmationService, MessageService } from 'primeng/api';
import { StockMovementService } from '../../stock-movement.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { heightAnimation } from 'app/shared/utils/animations';
import { ButtonModule } from 'primeng/button';
import { StockMovementState } from '../../stock-movement.state';
import SimpleIndicatorComponent from 'app/shared/components/simple-indicator/simple-indicator.component';
import { MovementItemComponent } from '../../components/movement-item/movement-item.component';
import { FormModule } from 'app/shared/components/form/form.module';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import dayjs from 'dayjs';

@Component({
  selector: 'fuse-stock-movement-list',
  templateUrl: './stock-movement-list.component.html',
  styleUrls: ['./stock-movement-list.component.scss'],
  animations: [heightAnimation],
  imports: [
    ButtonModule,
    SimpleIndicatorComponent,
    MovementItemComponent,
    FormModule,
    ReactiveFormsModule,
  ],
})
export class StockMovementListComponent implements OnInit {
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

  tableConfig: WritableSignal<TableConfig> = signal({
    rowsPerPageOptions: [5, 10, 20],
    rowsPerPage: 10,
    paginator: true,
    pageLinkSize: 5,
    columns: [
      { field: 'id', caption: 'ID', sortable: true, filter: true },
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
        type: 'custom',
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
      {
        field: 'actions',
        caption: 'Ações',
        actionButtonsType: 'buttons',
        actionButtons: [
          {
            icon: 'lucideSquarePen',
            label: 'Editar',
            tooltip: 'Editar Movimento',
            variant: 'text',
            action: (rowData: any) => {
              console.log(rowData);
              this.router.navigate([
                'dashboard/config/stock-movements/edit',
                rowData?.id,
              ]);
            },
          },
          {
            icon: 'lucideTrash2',
            label: 'Excluir',
            variant: 'text',
            colorText: '#EF4444',
            colorIcon: '#EF4444',
            tooltip: 'Excluir Movimento',
            action: (rowData: any) => {
              this.deleteStockMovement(rowData?.id);
            },
          },
        ],
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
    { label: 'Entrada', value: 'IN' },
    { label: 'Saída', value: 'OUT' },
  ]);

  formFilter = this.formBuilder.group({
    type: [null],
    date: [new Date()],
  });

  constructor() {}

  ngOnInit() {
    // Verifica se está visualizando movimentos de um produto específico
    this.productId = this.route.snapshot.paramMap.get('productId');

    this.loadStockMovements();
    this.state.getStockMetrics();

    if (this.productId) {
      this.coreService.setPageTitle(
        'Movimentos de Estoque',
        `Movimentos do produto ${this.productId}`
      );
    } else {
      this.coreService.setPageTitle(
        'Movimentos de Estoque',
        'Lista de movimentos de estoque'
      );
    }

    this.formFilter.valueChanges
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe(() => {
        this.onFilterChange();
      });
  }

  onFilterChange() {
    this.loadStockMovements();
  }

  private loadStockMovements() {
    const filter: any = this.formFilter.getRawValue();
    filter.date = dayjs(filter.date).format('YYYY-MM-DD');
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

  getMovementTypeBadge(type: string): string {
    switch (type) {
      case 'IN':
        return 'success';
      case 'OUT':
        return 'danger';
      case 'ADJUSTMENT':
        return 'warning';
      default:
        return 'info';
    }
  }

  getMovementTypeLabel(type: string): string {
    switch (type) {
      case 'IN':
        return 'Entrada';
      case 'OUT':
        return 'Saída';
      case 'ADJUSTMENT':
        return 'Ajuste';
      default:
        return type;
    }
  }

  newInbound() {
    this.router.navigate([{ outlets: { drawer: ['inbound', 'new'] } }]);
  }

  newOutbound() {
    this.router.navigate([{ outlets: { drawer: ['outbound', 'new'] } }]);
  }
}
