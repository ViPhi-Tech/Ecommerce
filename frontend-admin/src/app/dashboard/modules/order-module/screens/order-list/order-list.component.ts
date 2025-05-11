import {
  Component,
  inject,
  OnInit,
  signal,
  TemplateRef,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreService } from 'app/shared/services/core.service';
import { TableComponent } from 'app/shared/components/table/table.component';
import {
  DEFAULT_TABLE_CONFIG,
  TableConfig,
} from 'app/shared/interfaces/table.interfaces';

@Component({
  selector: 'fuse-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  imports: [TableComponent],
})
export class OrderListComponent implements OnInit {
  private router = inject(Router);
  private activateRoute = inject(ActivatedRoute);
  private coreService = inject(CoreService);

  @ViewChild('productName', { static: true }) productName!: TemplateRef<any>;

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
    this.activateRoute.data.subscribe(data => {
      this.coreService.adicionarBreadcrumb(data['breadcrumb']);
    });

    this.tableConfig.set({
      rowsPerPageOptions: [5, 10, 20],
      rowsPerPage: 10,
      paginator: true,
      pageLinkSize: 5,
      columns: [
        { field: 'id', caption: 'ID', sortable: true, filter: true },
        {
          field: 'name',
          caption: 'Nome',
          sortable: true,
          filter: true,
          template: this.productName,
        },
        { field: 'price', caption: 'Preço', sortable: true, filter: true },
        {
          field: 'category',
          caption: 'Categoria',
          sortable: true,
          filter: true,
        },
        {
          field: 'actions',
          caption: 'Ações',
          actionButtons: [
            {
              iconType: 'material',
              icon: 'check',
              color: 'success',
              tooltip: 'Confirmar Consolidação',
              show: data => {
                return !data?.caixa_consolidado && !data?.caixa_consolidado_dia;
              },
              action: (data, index) => {
                console.log('Confirmar Consolidação', data);
                console.log('Confirmar Consolidação', index);
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
