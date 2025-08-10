import {
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { CoreService } from 'app/shared/services/core.service';
import { TableComponent } from 'app/shared/components/table/table.component';
import { TableConfig } from 'app/shared/interfaces/table.interfaces';
import { TableFilterComponent } from 'app/shared/components/table/components/table-filter/table-filter.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProductService } from '../../product.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { heightAnimation } from 'app/shared/utils/animations';
import { NgIcon } from '@ng-icons/core';
import { ButtonModule } from 'primeng/button';
import { ProductState } from '../../product.state';
import { CurrencyPipe, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'fuse-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  animations: [heightAnimation],
  imports: [
    TableComponent,
    TableFilterComponent,
    NgIcon,
    ButtonModule,
    NgTemplateOutlet,
    CurrencyPipe,
  ],
})
export class ProductListComponent implements OnInit {
  private router = inject(Router);
  private coreService = inject(CoreService);
  private toast = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private productService = inject(ProductService);
  private destroyedRef = inject(DestroyRef);

  state = inject(ProductState);

  tableConfig = signal<TableConfig>({
    rowsPerPageOptions: [5, 10, 20],
    rowsPerPage: 10,
    paginator: true,
    pageLinkSize: 5,
    columns: [
      { field: 'id', caption: 'ID', sortable: true, filter: true },
      { field: 'name', caption: 'Nome', sortable: true, filter: true },
      {
        field: 'initialPrice',
        caption: 'Preço de Custo',
        type: 'currency',
        sortable: true,
        filter: true,
      },
      {
        field: 'finalPrice',
        caption: 'Preço de Venda',
        type: 'currency',
        sortable: true,
        filter: true,
      },
      {
        field: 'actions',
        caption: 'Ações',
        actionButtonsType: 'buttons',
        actionButtons: [
          {
            icon: 'lucideSquarePen',
            label: 'Editar',
            tooltip: 'Editar Produto',
            variant: 'text',
            action: (rowData: any) => {
              this.editProduct(rowData?.id);
            },
          },
          {
            icon: 'lucideTrash2',
            label: 'Excluir',
            variant: 'text',
            colorText: '#EF4444',
            colorIcon: '#EF4444',
            tooltip: 'Excluir Produto',
            action: (rowData: any) => {
              this.deleteProduct(rowData?.id);
            },
          },
        ],
      },
    ],
  });

  title = '';

  categorias = signal([
    { label: 'Dinheiro', value: 'money' },
    { label: 'Cartão de Crédito', value: 'credit_card' },
    { label: 'Cartão de Débito', value: 'debit_card' },
    { label: 'Transferência', value: 'transfer' },
    { label: 'Boleto', value: 'boleto' },
    { label: 'Pix', value: 'pix' },
    { label: 'Cheque', value: 'check' },
    { label: 'Vale', value: 'voucher' },
  ]);
  constructor() {
    effect(() => {
      if (this.productService.refreshProductList$()) {
        this.state.getProductList();
      }
    });
  }

  ngOnInit() {
    this.state.getProductList();
    this.coreService.setPageTitle('Produtos', 'Lista de produtos disponíveis');
  }

  addNewProduct() {
    this.router.navigate(['dashboard/products/new']);
  }

  refreshProducts() {
    this.state.getProductList();
  }

  editProduct(productId: string) {
    this.router.navigate(['dashboard/products/edit/', productId]);
  }

  deleteProduct(productId: string) {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja excluir este produto?',
      header: 'Confirmação de Exclusão',
      icon: 'pi pi-exclamation-triangle text-red-500',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.productService
          .deleteProduct(productId)
          .pipe(takeUntilDestroyed(this.destroyedRef))
          .subscribe({
            next: () => {
              this.toast.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Produto excluído com sucesso',
              });
              this.productService.refreshProductList();
            },
            error: () => {
              this.toast.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao excluir produto',
              });
            },
          });
      },
    });
  }
}
