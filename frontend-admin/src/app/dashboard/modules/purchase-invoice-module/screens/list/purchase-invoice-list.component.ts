import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CoreService } from 'app/shared/services/core.service';
import { TableComponent } from 'app/shared/components/table/table.component';
import { TableConfig } from 'app/shared/interfaces/table.interfaces';
import { ButtonModule } from 'primeng/button';
import { PurchaseInvoiceState } from '../../purchase-invoice.state';
import { PurchaseInvoice } from '../../purchase-invoice.service';

@Component({
  selector: 'fuse-purchase-invoice-list',
  templateUrl: './purchase-invoice-list.component.html',
  styleUrls: ['./purchase-invoice-list.component.scss'],
  imports: [TableComponent, ButtonModule],
})
export class PurchaseInvoiceListComponent implements OnInit {
  private router = inject(Router);
  private coreService = inject(CoreService);
  state = inject(PurchaseInvoiceState);

  tableConfig = signal<TableConfig>({
    rowsPerPageOptions: [5, 10, 20, 50],
    rowsPerPage: 10,
    paginator: true,
    pageLinkSize: 5,
    refresh: () => this.refreshPurchaseInvoices(),
    columns: [
      { field: 'id', caption: 'ID', sortable: true, width: '80px' },
      { field: 'number', caption: 'Número', sortable: true, width: '120px' },
      { field: 'series', caption: 'Série', sortable: true, width: '100px' },
      {
        field: 'accessKey',
        caption: 'Chave de Acesso',
        sortable: true,
        width: '300px',
      },
      {
        field: 'supplierName',
        caption: 'Fornecedor',
        sortable: true,
        width: '200px',
      },
      {
        field: 'issueDate',
        caption: 'Data de Emissão',
        sortable: true,
        width: '150px',
        type: 'date',
      },
      {
        field: 'entryDate',
        caption: 'Data de Entrada',
        sortable: true,
        width: '150px',
        type: 'date',
      },
      {
        field: 'totalAmount',
        caption: 'Valor Total',
        sortable: true,
        width: '150px',
        type: 'currency',
      },
      {
        field: 'actions',
        caption: 'Ações',
        actionButtonsType: 'buttons',
        actionButtons: [
          {
            icon: 'lucideEye',
            label: 'Visualizar',
            tooltip: 'Visualizar Nota Fiscal',
            variant: 'text',
            action: (rowData: PurchaseInvoice) => {
              this.router.navigate([
                '/dashboard/purchase-invoices',
                rowData.id,
                'view',
              ]);
            },
          },
        ],
      },
    ],
  });

  constructor() {}

  ngOnInit() {
    this.state.getPurchaseInvoiceList();
  }

  refreshPurchaseInvoices() {
    this.state.getPurchaseInvoiceList(true, true); // Force refresh do cache
  }

  getSupplierName(invoice: PurchaseInvoice): string {
    return invoice.supplier?.tradeName || invoice.supplier?.name || 'N/A';
  }

  // Método para preparar os dados da tabela com fornecedor formatado usando computed
  tableData = computed(() => {
    return this.state.purchaseInvoiceList().map(invoice => ({
      ...invoice,
      supplierName: this.getSupplierName(invoice),
    }));
  });
}
