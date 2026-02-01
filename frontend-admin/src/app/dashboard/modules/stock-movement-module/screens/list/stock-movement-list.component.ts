import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CoreService } from 'app/shared/services/core.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { StockMovementService } from '../../stock-movement.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { heightAnimation } from 'app/shared/utils/animations';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuItem } from 'primeng/api';
import { StockMovementState } from '../../stock-movement.state';
import SimpleIndicatorComponent from 'app/shared/components/simple-indicator/simple-indicator.component';
import { MovementItemComponent } from '../../components/movement-item/movement-item.component';
import { FormModule } from 'app/shared/components/form/form.module';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import dayjs from 'dayjs';

@Component({
  selector: 'fuse-stock-movement-list',
  templateUrl: './stock-movement-list.component.html',
  styleUrls: ['./stock-movement-list.component.scss'],
  animations: [heightAnimation],
  imports: [
    ButtonModule,
    SplitButtonModule,
    SimpleIndicatorComponent,
    MovementItemComponent,
    FormModule,
    ReactiveFormsModule,
    NgIcon,
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

  title = '';

  maxDate = signal(new Date());
  movementTypes = signal([
    { label: 'Todos', value: '' },
    { label: 'Entrada', value: 'IN' },
    { label: 'Saída', value: 'OUT' },
  ]);

  filterTypeMenuItems: MenuItem[] = [
    { label: 'Todos', command: () => this.setFilterType('') },
    { label: 'Entrada', command: () => this.setFilterType('IN') },
    { label: 'Saída', command: () => this.setFilterType('OUT') },
  ];

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

  onFilterChange() {
    this.loadStockMovements();
  }

  getSelectedTypeLabel(): string {
    const value = this.formFilter.get('type')?.value ?? '';
    const item = this.movementTypes().find(m => m.value === value);
    return item?.label ?? 'Filtrar por';
  }

  setFilterType(value: string) {
    this.formFilter.patchValue({ type: value });
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

  openImportModal() {
    this.router.navigate([{ outlets: { drawer: ['import-nfe'] } }]);
  }
}
