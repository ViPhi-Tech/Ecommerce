import {
  Component,
  input,
  OnInit,
  output,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { PanelModule } from 'primeng/panel';
import {
  DEFAULT_TABLE_CONFIG,
  TableConfig,
} from 'app/shared/interfaces/table.interfaces';
import { TableComponent } from '../table/table.component';
import { NgIcon } from '@ng-icons/core';
import { TooltipModule } from 'primeng/tooltip';
import { InvoiceDetails } from 'app/shared/interfaces/invoice/InvoiceDetails';
@Component({
  selector: 'fuse-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.scss'],
  imports: [
    PanelModule,
    TableComponent,
    TooltipModule,
    NgIcon,
  ],
})
export class InvoiceDetailsComponent implements OnInit {
  invoice = input<InvoiceDetails>();

  @ViewChild('statusProductTemplate', { static: true })
  statusProductTemplate!: TemplateRef<any>;

  tableConfig = signal<TableConfig>(DEFAULT_TABLE_CONFIG);

  removeProduct = output<string>();

  constructor() {}

  ngOnInit() {
    this.initTable();
  }

  initTable() {
    this.tableConfig.set({
      rowsPerPageOptions: [5, 10, 20],
      rowsPerPage: 10,
      paginator: true,
      pageLinkSize: 5,
      columns: [
        {
          field: 'status',
          caption: 'Status',
          template: this.statusProductTemplate,
          align: 'center',
          width: '80px',
        },
        {
          field: 'sku',
          caption: 'Cód. Prod',
          sortable: true,
          width: '100px',
        },
        { 
          field: 'description', 
          caption: 'Descrição', 
          sortable: true, 
          filter: true 
        },
        {
          field: 'ncm',
          caption: 'NCM',
          sortable: true,
          width: '100px',
        },
        {
          field: 'cst',
          caption: 'CST',
          sortable: true,
          width: '80px',
        },
        {
          field: 'cfop',
          caption: 'CFOP',
          sortable: true,
          width: '80px',
        },
        {
          field: 'unit',
          caption: 'UN.',
          sortable: true,
          align: 'center',
          width: '80px',
        },
        {
          field: 'quantity',
          caption: 'Quant.',
          sortable: true,
          align: 'right',
          width: '100px',
        },
        {
          field: 'unitValue',
          caption: 'V. Unitário',
          sortable: true,
          align: 'right',
          width: '120px',
          type: 'currency',
        },
        {
          field: 'discount',
          caption: 'V. Desc.',
          sortable: true,
          align: 'right',
          width: '120px',
          type: 'currency',
        },
        {
          field: 'totalValue',
          caption: 'V. Total',
          sortable: true,
          align: 'right',
          width: '120px',
          type: 'currency',
        },
        {
          field: 'unitCost',
          caption: 'V. Custo Unit.',
          sortable: true,
          align: 'right',
          width: '130px',
          type: 'currency',
        },
        {
          field: 'totalCost',
          caption: 'Total Custo',
          sortable: true,
          align: 'right',
          width: '120px',
          type: 'currency',
        },
        {
          field: 'unitTotalWithTax',
          caption: 'V. Unit. c/ Tributo',
          sortable: true,
          align: 'right',
          width: '150px',
          type: 'currency',
        },
        {
          field: 'totalWithTax',
          caption: 'Total c/ Tributo',
          sortable: true,
          align: 'right',
          width: '140px',
          type: 'currency',
        },
        {
          field: 'icmsBase',
          caption: 'BC ICMS',
          sortable: true,
          align: 'right',
          width: '120px',
          type: 'currency',
        },
        {
          field: 'icmsValue',
          caption: 'V. ICMS',
          sortable: true,
          align: 'right',
          width: '120px',
          type: 'currency',
        },
        {
          field: 'icmsStBase',
          caption: 'BC ICMS ST',
          sortable: true,
          align: 'right',
          width: '120px',
          type: 'currency',
        },
        {
          field: 'icmsStValue',
          caption: 'V. ICMS ST',
          sortable: true,
          align: 'right',
          width: '120px',
          type: 'currency',
        },
        {
          field: 'ipiValue',
          caption: 'V. IPI',
          sortable: true,
          align: 'right',
          width: '120px',
          type: 'currency',
        },
        {
          field: 'icmsRate',
          caption: 'Alíq. ICMS',
          sortable: true,
          align: 'right',
          width: '100px',
          type: 'percent',
        },
        {
          field: 'ipiRate',
          caption: 'Alíq. IPI',
          sortable: true,
          align: 'right',
          width: '100px',
          type: 'percent',
        },
        {
          field: 'actions',
          caption: 'Ações',
          actionButtonsType: 'buttons',
          width: '100px',
          actionButtons: [
            {
              icon: 'lucideTrash2',
              label: 'Excluir',
              variant: 'text',
              colorText: '#EF4444',
              colorIcon: '#EF4444',
              tooltip: 'Excluir Produto',
              action: (rowData: any) => {
                this.removeProduct.emit(rowData?.itemNumber || rowData?.id);
              },
            },
          ],
        },
      ],
    });
  }
}
