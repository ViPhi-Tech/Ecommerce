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
          field: 'description', 
          caption: 'Nome', 
          sortable: true, 
          filter: true 
        },
        {
          field: 'quantity',
          caption: 'Quantidade',
          sortable: true,
          align: 'right',
          width: '120px',
        },
        {
          field: 'unit',
          caption: 'Unidade',
          sortable: true,
          align: 'center',
          width: '100px',
        },
        {
          field: 'unitValue',
          caption: 'Valor Unitário',
          sortable: true,
          align: 'right',
          width: '150px',
          type: 'currency',
        },
        {
          field: 'totalValue',
          caption: 'Valor Total',
          sortable: true,
          align: 'right',
          width: '150px',
          type: 'currency',
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
