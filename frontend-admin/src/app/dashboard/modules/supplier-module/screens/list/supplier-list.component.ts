import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { Router } from '@angular/router';
import { CoreService } from 'app/shared/services/core.service';
import { TableComponent } from 'app/shared/components/table/table.component';
import { TableConfig } from 'app/shared/interfaces/table.interfaces';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SupplierService } from '../../supplier.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SupplierState } from '../../supplier.state';

@Component({
  selector: 'fuse-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss'],
  imports: [TableComponent, ButtonModule, DialogModule, ButtonModule],
})
export class SupplierListComponent implements OnInit {
  private toast = inject(MessageService);
  private supplierService = inject(SupplierService);
  private destroyedRef = inject(DestroyRef);
  private confirmationService = inject(ConfirmationService);
  private router = inject(Router);
  private coreService = inject(CoreService);
  state = inject(SupplierState);

  visible = false;

  tableConfig: WritableSignal<TableConfig> = signal({
    rowsPerPageOptions: [5, 10, 20],
    rowsPerPage: 10,
    paginator: true,
    pageLinkSize: 5,
    headerButtons: [
      {
        icon: 'pi pi-plus',
        label: 'Adicionar',
        tooltip: 'Adicionar Fornecedor',
        action: () => {
          // Exemplo de navegação para o outlet auxiliar "drawer"
          this.router.navigate([{ outlets: { drawer: ['suppliers', 'new'] } }]);
        },
      },
    ],
    columns: [
      { field: 'id', caption: 'ID', sortable: true, filter: true },
      { field: 'name', caption: 'Nome', sortable: true, filter: true },
      { field: 'email', caption: 'Email', sortable: true, filter: true },
      { field: 'phone', caption: 'Telefone', sortable: true, filter: true },
      { field: 'cnpj', caption: 'CNPJ', sortable: true, filter: true },
      {
        field: 'actions',
        caption: 'Ações',
        actionButtonsType: 'buttons',
        actionButtons: [
          {
            icon: 'lucideSquarePen',
            label: 'Editar',
            tooltip: 'Editar Fornecedor',
            variant: 'text',
            action: (rowData: any) => {
              // Exemplo de navegação para o outlet auxiliar "drawer"
              console.log(rowData);
              this.router.navigate([
                { outlets: { drawer: ['suppliers', rowData?.id] } },
              ]);
            },
          },
          {
            icon: 'lucideTrash2',
            label: 'Excluir',
            variant: 'text',
            colorText: '#EF4444',
            colorIcon: '#EF4444',
            tooltip: 'Excluir Fornecedor',
            action: (rowData: any) => {
              this.deleteSupplier(rowData?.id);
            },
          },
        ],
      },
    ],
  });

  constructor() {}

  ngOnInit() {
    this.state.getSupplierList();
    this.coreService.setPageTitle(
      'Fornecedores',
      'Lista de fornecedores disponíveis'
    );
  }

  deleteSupplier(id: string) {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja excluir este fornecedor?',
      header: 'Confirmação de Exclusão',
      icon: 'pi pi-exclamation-triangle text-red-500',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.supplierService
          .deleteSupplier(id)
          .pipe(takeUntilDestroyed(this.destroyedRef))
          .subscribe({
            next: () => {
              this.toast.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Fornecedor excluído com sucesso',
              });
              this.state.getSupplierList();
            },
            error: () => {
              this.toast.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao excluir fornecedor',
              });
            },
          });
      },
    });
  }
}
