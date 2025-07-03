import {
  Component,
  inject,
  OnInit,
  signal,
  TemplateRef,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { Router } from '@angular/router';
import { CoreService } from 'app/shared/services/core.service';
import { TableComponent } from 'app/shared/components/table/table.component';
import {
  DEFAULT_TABLE_CONFIG,
  TableConfig,
} from 'app/shared/interfaces/table.interfaces';
import { TableFilterComponent } from 'app/shared/components/table/components/table-filter/table-filter.component';
import { OrderState } from '../../order.state';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { ButtonModule } from 'primeng/button';
import { heightAnimation } from 'app/shared/utils/animations';

@Component({
  selector: 'fuse-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  animations: [heightAnimation],
  imports: [
    TableComponent,
    TableFilterComponent,
    CommonModule,
    NgIcon,
    ButtonModule,
  ],
  providers: [OrderState],
})
export class OrderListComponent implements OnInit {
  private router = inject(Router);
  private coreService = inject(CoreService);
  state = inject(OrderState);

  @ViewChild('name', { static: true }) name!: TemplateRef<any>;

  tableConfig: WritableSignal<TableConfig> = signal(DEFAULT_TABLE_CONFIG);

  title = '';

  constructor() {}

  ngOnInit() {
    this.coreService.setPageTitle(
      'Lista de Pedidos',
      'Listagem com os pedidos realizados'
    );
    this.setTableConfig();
    this.state.getOrderList();
  }

  setTableConfig() {
    this.tableConfig.set({
      rowsPerPageOptions: [5, 10, 20],
      rowsPerPage: 10,
      paginator: true,
      pageLinkSize: 5,
      columns: [
        { field: 'id', caption: 'Cód. Pedido', sortable: true, filter: true },
        {
          field: 'customerName',
          caption: 'Cliente',
          sortable: true,
          filter: true,
        },
        {
          field: 'total',
          caption: 'Valor',
          type: 'currency',
          sortable: true,
          filter: true,
        },
        { field: 'status', caption: 'Status', sortable: true, filter: true },
        {
          field: 'createdAt',
          caption: 'Data de Criação',
          type: 'datetime',
          sortable: true,
          filter: true,
        },
        {
          field: 'actions',
          caption: 'Ações',
          actionButtons: [
            {
              icon: 'lucideEye',
              color: 'info',
              variant: 'text',
              tooltip: 'Visualizar Pedido',
              action: (data, index) => {
                console.log('Visualizar Pedido', data, index);
              },
            },
            {
              icon: 'lucideSquarePen',
              color: 'primary',
              variant: 'text',
              tooltip: 'Editar Pedido',
              action: (data, index) => {
                console.log('Editar Pedido', data, index);
              },
            },
            {
              icon: 'lucideTrash2',
              color: 'warn',
              variant: 'text',
              tooltip: 'Excluir Pedido',
              action: (data, index) => {
                console.log('Excluir Pedido', data, index);
              },
            },
          ],
        },
      ],
      headerButtons: [
        {
          icon: 'pi pi-plus',
          label: 'Criar Pedido',
          tooltip: 'Criar Pedido',
          action: () => {
            this.router.navigate(['dashboard', 'orders', 'new']);
          },
        },
      ],
    });
  }
}
