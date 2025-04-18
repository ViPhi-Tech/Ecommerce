import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreService } from '../../../../../shared/services/core.service';
import { TableComponent } from '../../../../../shared/components/table/table.component';
import { TableConfig } from '../../../../../shared/interfaces/table.interfaces';

@Component({
  selector: 'fuse-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
  imports: [TableComponent],
})
export class CategoryListComponent implements OnInit {
  private router = inject(Router);
  private activateRoute = inject(ActivatedRoute);
  private coreService = inject(CoreService);

  categorys = signal([
    {
      id: 1,
      name: 'Categoria 1',
      price: 10.0,
      category: 'Categoria 1',
    },
    {
      id: 2,
      name: 'Categoria 2',
      price: 20.0,
      category: 'Categoria 2',
    },
    {
      id: 3,
      name: 'Categoria 3',
      price: 30.0,
      category: 'Categoria 3',
    },
    {
      id: 4,
      name: 'Categoria 4',
      price: 40.0,
      category: 'Categoria 4',
    },
    {
      id: 5,
      name: 'Categoria 5',
      price: 50.0,
      category: 'Categoria 5',
    },
    {
      id: 6,
      name: 'Categoria 6',
      price: 60.0,
      category: 'Categoria 6',
    },
    {
      id: 7,
      name: 'Categoria 7',
      price: 70.0,
      category: 'Categoria 7',
    },
    {
      id: 8,
      name: 'Categoria 8',
      price: 80.0,
      category: 'Categoria 8',
    },
    {
      id: 9,
      name: 'Categoria 9',
      price: 90.0,
      category: 'Categoria 9',
    },
    {
      id: 10,
      name: 'Categoria 10',
      price: 100.0,
      category: 'Categoria 10',
    },
  ]);
  loading = signal(false);

  tableConfig: WritableSignal<TableConfig> = signal({
    rowsPerPageOptions: [5, 10, 20],
    rowsPerPage: 10,
    paginator: true,
    pageLinkSize: 5,
    columns: [
      { field: 'id', caption: 'ID', sortable: true, filter: true },
      { field: 'name', caption: 'Nome', sortable: true, filter: true },
      { field: 'price', caption: 'Preço', sortable: true, filter: true },
      { field: 'category', caption: 'Categoria', sortable: true, filter: true },
    ],
    headerButtons: [
      {
        icon: 'pi pi-plus',
        label: 'Adicionar Categoria',
        tooltip: 'Adicionar Categoria',
        action: () => {
          // Exemplo de navegação para o outlet auxiliar "drawer"
          this.router.navigate([
            { outlets: { drawer: ['categories', 'new'] } },
          ]);
        },
      },
    ],
  });

  title = '';

  constructor() {}

  ngOnInit() {
    this.activateRoute.data.subscribe(data => {
      this.coreService.adicionarBreadcrumb(data['breadcrumb']);
    });
  }
}
