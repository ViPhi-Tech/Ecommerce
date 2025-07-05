import {
  Component,
  input,
  OnInit,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { InvoiceDetails } from '../../interfaces/invoice.interface';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import {
  DEFAULT_TABLE_CONFIG,
  TableConfig,
} from 'app/shared/interfaces/table.interfaces';
import { TableComponent } from '../table/table.component';
import { NgIcon } from '@ng-icons/core';
import { TooltipModule } from 'primeng/tooltip';
@Component({
  selector: 'fuse-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.scss'],
  imports: [
    CurrencyPipe,
    DatePipe,
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

  constructor() {}

  ngOnInit() {
    console.log('Invoice Details:', this.invoice());
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
        },
        { field: 'description', caption: 'Nome', sortable: true, filter: true },
        {
          field: 'actions',
          caption: 'Ações',
          actionButtonsType: 'buttons',
          actionButtons: [
            {
              icon: 'lucideSquarePen',
              label: 'Editar',
              tooltip: 'Editar Categoria',
              variant: 'text',
              action: (rowData: any) => {},
            },
            {
              icon: 'lucideTrash2',
              label: 'Excluir',
              variant: 'text',
              colorText: '#EF4444',
              colorIcon: '#EF4444',
              tooltip: 'Excluir Categoria',
              action: (rowData: any) => {},
            },
          ],
        },
      ],
    });
  }
}
