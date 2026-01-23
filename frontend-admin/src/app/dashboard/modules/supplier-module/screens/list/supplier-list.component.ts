import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
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
import { ISupplier } from 'app/shared/interfaces/supplier/Supplier';

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

  tableConfig = signal<TableConfig>({
    rowsPerPageOptions: [5, 10, 20],
    rowsPerPage: 10,
    paginator: true,
    pageLinkSize: 5,
    columns: [
      { field: 'id', caption: 'ID', sortable: true },
      { field: 'legalName', caption: 'Razão Social', sortable: true },
      { field: 'email', caption: 'Email', sortable: true },
      { field: 'phone', caption: 'Telefone', sortable: true, type: 'phone' },
      { field: 'cnpj', caption: 'CNPJ', sortable: true, type: 'document' },
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
            action: (rowData: ISupplier) => {
              // Exemplo de navegação para o outlet auxiliar "drawer"
              this.router.navigate([
                { outlets: { drawer: ['suppliers', rowData?.uuid] } },
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
            action: (rowData: ISupplier) => {
              this.deleteSupplier(rowData?.uuid);
            },
          },
        ],
      },
    ],
  });

  constructor() {}

  ngOnInit() {
    this.state.getSupplierList();
  }

  addNewSupplier() {
    this.router.navigate([{ outlets: { drawer: ['suppliers', 'new'] } }]);
  }

  refreshSuppliers() {
    this.state.getSupplierList(true, true); // Force refresh do cache
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
