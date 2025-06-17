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
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'fuse-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
  imports: [
    TableComponent,
    ButtonModule,
    DialogModule,
    ButtonModule
  ],
})
export class CategoryListComponent implements OnInit {
  private router = inject(Router);
  private coreService = inject(CoreService);
  state = inject(CategoryState);

  visible = false

  tableConfig: WritableSignal<TableConfig> = signal({
    rowsPerPageOptions: [5, 10, 20],
    rowsPerPage: 10,
    paginator: true,
    pageLinkSize: 5,
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
    columns: [
      { field: 'id', caption: 'ID', sortable: true, filter: true },
      { field: 'name', caption: 'Nome', sortable: true, filter: true },
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
            action: (rowData: any) => {
              // Exemplo de navegação para o outlet auxiliar "drawer"
              console.log(rowData);
              this.router.navigate([
                { outlets: { drawer: ['categories', rowData?.id] } },
              ]);
            },
          },
          {
            icon: 'lucideTrash2',
            label: 'Excluir',
            variant: 'text',
            colorText: '#EF4444',
            colorIcon: '#EF4444',
            tooltip: 'Excluir Categoria',
            action: (rowData: any) => {
              this.deleteCategory(rowData?.id);
            },
          },
        ],
      },
    ],
  });

  constructor() {}

  deleteCategory(id: number) {
    this.visible = true;
    // Aqui você pode implementar a lógica para excluir a categoria
    // Por exemplo, chamar um serviço para excluir a categoria pelo ID
    console.log(`Categoria com ID ${id} excluída.`);
    // Após a exclusão, você pode atualizar a lista de categorias ou fechar o diálogo
  }

  ngOnInit() {
    this.state.getCategoryList();
    this.coreService.setPageTitle(
      'Categorias',
      'Lista de categorias disponíveis'
    );
  }
}
