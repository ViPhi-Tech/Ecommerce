import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Dialog, DialogModule } from 'primeng/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import dayjs from 'dayjs';
import {
  PurchaseInvoice,
  PurchaseInvoiceService,
} from '../../purchase-invoice.service';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableComponent } from 'app/shared/components/table/table.component';
import { TableConfig } from 'app/shared/interfaces/table.interfaces';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'fuse-purchase-invoice-view',
  templateUrl: './purchase-invoice-view.component.html',
  styleUrls: ['./purchase-invoice-view.component.scss'],
  imports: [
    DialogModule,
    ButtonModule,
    CommonModule,
    CardModule,
    TagModule,
    DividerModule,
    PanelModule,
    ProgressSpinnerModule,
    TableComponent,
    CurrencyPipe,
  ],
})
export class PurchaseInvoiceViewComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private toast = inject(MessageService);
  private purchaseInvoiceService = inject(PurchaseInvoiceService);

  @ViewChild('dialogRef') dialogRef!: Dialog;

  // signals
  visible = signal(false);
  isLoading = signal(true);
  purchaseInvoiceData = signal<PurchaseInvoice | null>(null);
  title = signal('Visualizar Nota Fiscal');

  destroyedRef = inject(DestroyRef);

  tableConfig = signal<TableConfig>({
    rowsPerPageOptions: [10, 20, 50],
    rowsPerPage: 10,
    paginator: true,
    pageLinkSize: 5,
    columns: [
      { field: 'code', caption: 'Código', sortable: true, width: '100px' },
      { field: 'description', caption: 'Descrição', sortable: true, filter: true },
      { field: 'ncm', caption: 'NCM', sortable: true, width: '100px' },
      { field: 'cst', caption: 'CST', sortable: true, width: '80px' },
      { field: 'cfop', caption: 'CFOP', sortable: true, width: '80px' },
      { field: 'unit', caption: 'UN.', sortable: true, align: 'center', width: '80px' },
      { field: 'quantity', caption: 'Quant.', sortable: true, align: 'right', width: '100px' },
      { field: 'unitPrice', caption: 'V. Unitário', sortable: true, align: 'right', width: '120px', type: 'currency' },
      { field: 'discount', caption: 'V. Desc.', sortable: true, align: 'right', width: '120px', type: 'currency' },
      { field: 'totalAmount', caption: 'V. Total', sortable: true, align: 'right', width: '120px', type: 'currency' },
      { field: 'unitCost', caption: 'V. Custo Unit.', sortable: true, align: 'right', width: '130px', type: 'currency' },
      { field: 'totalCost', caption: 'Total Custo', sortable: true, align: 'right', width: '120px', type: 'currency' },
      { field: 'unitTotalWithTax', caption: 'V. Unit. c/ Tributo', sortable: true, align: 'right', width: '150px', type: 'currency' },
      { field: 'totalWithTax', caption: 'Total c/ Tributo', sortable: true, align: 'right', width: '140px', type: 'currency' },
      { field: 'icmsStBase', caption: 'BC ICMS ST', sortable: true, align: 'right', width: '120px', type: 'currency' },
      { field: 'icmsStValue', caption: 'V. ICMS ST', sortable: true, align: 'right', width: '120px', type: 'currency' },
      { field: 'ipiValue', caption: 'V. IPI', sortable: true, align: 'right', width: '120px', type: 'currency' },
      { field: 'ipiRate', caption: 'Alíq. IPI', sortable: true, align: 'right', width: '100px', type: 'percent' },
    ],
  });

  ngOnInit() {
    this.activatedRoute.params
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe(params => {
        const id = params['id'];
        if (id) {
          this.loadPurchaseInvoiceData(id);
        } else {
          this.onCloseDialog();
        }
      });
  }

  async loadPurchaseInvoiceData(id: number | string): Promise<void> {
    this.isLoading.set(true);

    this.purchaseInvoiceService
      .getPurchaseInvoiceById(id)
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe({
        next: (response: ApiResponse<PurchaseInvoice>) => {
          const invoice = response.dados || response.data;
          if (invoice) {
            this.purchaseInvoiceData.set(invoice);
            this.title.set(
              `Nota Fiscal ${invoice.series || ''}-${invoice.number || ''}`
            );
            this.isLoading.set(false);
            this.visible.set(true);
          } else {
            this.isLoading.set(false);
            this.toast.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Nota fiscal não encontrada',
            });
            this.onCloseDialog();
          }
        },
        error: (error: any) => {
          this.isLoading.set(false);
          this.toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar dados da nota fiscal',
          });
          this.onCloseDialog();
          console.error('Erro ao carregar nota fiscal:', error);
        },
      });
  }

  onCloseDialog() {
    this.router.navigate(['/dashboard/purchase-invoices']);
  }

  formatDate(date: Date | string | null | undefined): string {
    if (!date) return 'N/A';
    return dayjs(date).format('DD/MM/YYYY');
  }

  formatDateTime(date: Date | string | null | undefined): string {
    if (!date) return 'N/A';
    return dayjs(date).format('DD/MM/YYYY HH:mm');
  }
}
