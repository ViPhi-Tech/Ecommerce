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
import { OrderState } from '../../states/order.state';
import { TableFilterComponent } from 'app/shared/components/table/components/table-filter/table-filter.component';

@Component({
  selector: 'fuse-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  imports: [TableComponent, TableFilterComponent],
  providers: [OrderState],
})
export class OrderListComponent implements OnInit {
  private router = inject(Router);
  private coreService = inject(CoreService);
  state = inject(OrderState);

  @ViewChild('name', { static: true }) name!: TemplateRef<any>;

  orders = signal([
    {
      id: 1,
      name: 'Produto 1',
      price: 10.0,
      category: 'Categoria 1',
    },
    {
      id: 2,
      name: 'Produto 2',
      price: 20.0,
      category: 'Categoria 2',
    },
    {
      id: 3,
      name: 'Produto 3',
      price: 30.0,
      category: 'Categoria 3',
    },
    {
      id: 4,
      name: 'Produto 4',
      price: 40.0,
      category: 'Categoria 4',
    },
    {
      id: 5,
      name: 'Produto 5',
      price: 50.0,
      category: 'Categoria 5',
    },
    {
      id: 6,
      name: 'Produto 6',
      price: 60.0,
      category: 'Categoria 6',
    },
    {
      id: 7,
      name: 'Produto 7',
      price: 70.0,
      category: 'Categoria 7',
    },
    {
      id: 8,
      name: 'Produto 8',
      price: 80.0,
      category: 'Categoria 8',
    },
    {
      id: 9,
      name: 'Produto 9',
      price: 90.0,
      category: 'Categoria 9',
    },
    {
      id: 10,
      name: 'Produto 10',
      price: 100.0,
      category: 'Categoria 10',
    },
  ]);
  loading = signal(false);

  tableConfig: WritableSignal<TableConfig> = signal(DEFAULT_TABLE_CONFIG);

  title = '';

  constructor() {}

  ngOnInit() {
    this.coreService.setPageTitle(
      'Lista de Pedidos',
      'Listagem com os pedidos realizados'
    );
    this.setTableConfig();
  }

  setTableConfig() {
    this.tableConfig.set({
      rowsPerPageOptions: [5, 10, 20],
      rowsPerPage: 10,
      paginator: true,
      pageLinkSize: 5,
      columns: [
        { field: 'id', caption: 'ID', sortable: true, filter: true },
        { field: 'customer', caption: 'Cliente', sortable: true, filter: true },
        { field: 'date', caption: 'Data', sortable: true, filter: true },
        {
          field: 'total',
          caption: 'Valor Total',
          sortable: true,
          filter: true,
        },
        { field: 'status', caption: 'Status', sortable: true, filter: true },
        {
          field: 'actions',
          caption: 'Ações',
          actionButtons: [
            {
              iconType: 'material',
              icon: 'visibility',
              color: 'info',
              tooltip: 'Visualizar Pedido',
              action: (data, index) => {
                console.log('Visualizar Pedido', data, index);
              },
            },
            {
              iconType: 'material',
              icon: 'edit',
              color: 'primary',
              tooltip: 'Editar Pedido',
              action: (data, index) => {
                console.log('Editar Pedido', data, index);
              },
            },
            {
              iconType: 'material',
              icon: 'delete',
              color: 'warn',
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
            // Exemplo de navegação para o outlet auxiliar "drawer"
            this.router.navigate(['dashboard', 'orders', 'create']);
          },
        },
      ],
    });
  }
}
