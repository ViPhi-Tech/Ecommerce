import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CoreService } from 'app/shared/services/core.service';
import { TableComponent } from 'app/shared/components/table/table.component';
import { TableConfig } from 'app/shared/interfaces/table.interfaces';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CategoryService } from '../../category.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CategoryState } from '../../category.state';

@Component({
  selector: 'fuse-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
  imports: [TableComponent, ButtonModule, DialogModule, ButtonModule],
})
export class CategoryListComponent implements OnInit {
  private toast = inject(MessageService);
  private categoryService = inject(CategoryService);
  private destroyedRef = inject(DestroyRef);
  private confirmationService = inject(ConfirmationService);
  private router = inject(Router);
  private coreService = inject(CoreService);
  state = inject(CategoryState);

  visible = false;

  tableConfig = signal<TableConfig>({
    rowsPerPageOptions: [5, 10, 20],
    rowsPerPage: 10,
    paginator: true,
    pageLinkSize: 5,
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

  ngOnInit() {
    this.state.getCategoryList();
    this.coreService.setPageTitle(
      'Categorias',
      'Lista de categorias disponíveis'
    );
  }

  addNewCategory() {
    this.router.navigate([{ outlets: { drawer: ['categories', 'new'] } }]);
  }

  refreshCategories() {
    this.state.getCategoryList();
  }

  deleteCategory(id: string) {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja excluir esta categoria?',
      header: 'Confirmação de Exclusão',
      icon: 'pi pi-exclamation-triangle text-red-500',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.categoryService
          .deleteCategory(id)
          .pipe(takeUntilDestroyed(this.destroyedRef))
          .subscribe({
            next: () => {
              this.toast.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Categoria excluída com sucesso',
              });
              this.state.getCategoryList();
            },
            error: () => {
              this.toast.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao excluir categoria',
              });
            },
          });
      },
    });
  }
}
