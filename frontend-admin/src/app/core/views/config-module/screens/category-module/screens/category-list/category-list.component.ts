import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { Router } from '@angular/router';
import { CoreService } from 'app/shared/services/core.service';
import { TableComponent } from 'app/shared/components/table/table.component';
import { TableConfig } from 'app/shared/interfaces/table.interfaces';
import { CategoryState } from 'app/shared/store/category.state';

@Component({
  selector: 'fuse-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
  imports: [TableComponent],
})
export class CategoryListComponent implements OnInit {
  private router = inject(Router);
  private coreService = inject(CoreService);
  state = inject(CategoryState);

  tableConfig: WritableSignal<TableConfig> = signal({
    rowsPerPageOptions: [5, 10, 20],
    rowsPerPage: 10,
    paginator: true,
    pageLinkSize: 5,
    columns: [
      { field: 'id', caption: 'ID', sortable: true, filter: true },
      { field: 'name', caption: 'Nome', sortable: true, filter: true },
      {
        field: 'description',
        caption: 'Descrição',
        sortable: false,
        filter: true,
      },
      {
        field: 'parentCategoryId',
        caption: 'Categoria Pai',
        sortable: true,
        filter: true,
      },
      {
        field: 'createdAt',
        caption: 'Data de Criação',
        type: 'date',
        sortable: true,
        filter: true,
      },
      {
        field: 'updatedAt',
        caption: 'Última Atualização',
        type: 'date',
        sortable: true,
        filter: true,
      },
      {
        field: 'isActive',
        caption: 'Ativo',
        type: 'activeOrNot',
        sortable: true,
        filter: true,
      },
      { field: 'imageUrl', caption: 'Imagem', sortable: false, filter: false },
    ],
    headerButtons: [
      {
        icon: 'pi pi-plus',
        label: 'Adicionar',
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

  constructor() {}

  ngOnInit() {
    this.state.getCategoryList();
    this.coreService.setPageTitle(
      'Categorias',
      'Lista de categorias disponíveis'
    );
  }
}
