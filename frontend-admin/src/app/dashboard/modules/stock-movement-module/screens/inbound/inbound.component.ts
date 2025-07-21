import { CurrencyPipe } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'app/dashboard/modules/product-module/product.service';
import { FormModule } from 'app/shared/components/form/form.module';
import { ImportInvoiceComponent } from 'app/shared/components/import-invoice/import-invoice.component';
import { ImportInvoiceService } from 'app/shared/components/import-invoice/import-invoice.service';
import { TableComponent } from 'app/shared/components/table/table.component';
import { Product } from 'app/shared/interfaces/product-module.interface';
import {
  DEFAULT_TABLE_CONFIG,
  TableConfig,
} from 'app/shared/interfaces/table.interfaces';
import { CoreService } from 'app/shared/services/core.service';
import { MessageService } from 'primeng/api';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { Dialog, DialogModule } from 'primeng/dialog';
import { FieldsetModule } from 'primeng/fieldset';
import { TabsModule } from 'primeng/tabs';
import { StockMovementService } from '../../stock-movement.service';

@Component({
  selector: 'fuse-inbound',
  templateUrl: './inbound.component.html',
  imports: [
    TabsModule,
    ButtonModule,
    FieldsetModule,
    FormModule,
    ReactiveFormsModule,
    ImportInvoiceComponent,
    DialogModule,
    TableComponent,
    DialogModule,
    AutoCompleteModule,
    CurrencyPipe,
  ],
})
export class InboundComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private coreService = inject(CoreService);
  private toast = inject(MessageService);
  // Services
  private stockMovementService = inject(StockMovementService);
  private productService = inject(ProductService);

  @ViewChild('dialogRef') dialogRef!: Dialog;

  private importInvoiceService = inject(ImportInvoiceService);

  nfModel = signal([
    { label: 'NF-e (Mod. 55)', value: '55', key: '55' },
    { label: 'NF (Mod. 01)', value: '01', key: '01' },
    { label: 'NF Produtor (Mod. 04)', value: '04', key: '04' },
  ]);

  inboundData: FormGroup = new FormGroup({});

  // signals
  visible = signal(true);
  title = signal('Entrada de Produtos');
  subtitle = signal('Cadastro de nova entrada de produtos');
  showSelectProductDialog = signal(false);
  filteredProducts = signal<any[]>([]);

  tableConfig = signal<TableConfig>(DEFAULT_TABLE_CONFIG);

  formAddProduct = this.fb.group({
    productId: [null, [Validators.required]],
    quantity: [1, [Validators.required, Validators.min(1)]],
  });

  constructor() {
    this.initForm();
    this.initProductsTable();
    this.onImportNFe();
  }

  ngOnInit() {
    this.coreService.setPageTitle(
      'Nova entrada',
      'Cadastro de nova entrada de produtos'
    );
  }

  // ========== INICIALIZAÇÃO ==========

  initForm() {
    this.inboundData = this.fb.group({
      nfModel: [this.nfModel()[0].value, [Validators.required]],
      products: [[]],
      identification: [],
      issuer: [],
      recipient: [],
      totals: [],
      transportation: [],
    });
  }

  initProductsTable() {
    this.tableConfig.set({
      ...DEFAULT_TABLE_CONFIG,
      emptyMessage: 'Nenhum produto selecionado',
      textWrap: false,
      showClearFilters: false,
      showExport: false,
      headerButtons: [
        {
          icon: 'pi pi-plus',
          label: 'Adicionar',
          tooltip: 'Adicionar produto',
          action: () => {
            this.formAddProduct.reset();
            this.showSelectProductDialog.set(true);
          },
        },
      ],
      columns: [
        { field: 'name', caption: 'Nome' },
        { field: 'sku', caption: 'SKU', maxWidth: '200px' },
        { field: 'ean', caption: 'EAN', maxWidth: '200px' },
        {
          field: 'quantity',
          caption: 'Quantidade',
          sortable: true,
          maxWidth: '150px',
        },
        {
          field: 'stock',
          caption: 'Estoque atual',
          sortable: true,
          maxWidth: '150px',
        },
        {
          field: 'actions',
          caption: 'Ações',
          actionButtonsType: 'buttons',
          actionButtons: [
            {
              icon: 'lucideTrash2',
              label: 'Remover',
              variant: 'text',
              colorText: '#EF4444',
              colorIcon: '#EF4444',
              tooltip: 'Remover Produto',
              action: (rowData: any) => {
                this.removeProduct(rowData?.id);
              },
            },
          ],
        },
      ],
    });
  }

  // ========== SUBMISSÃO DE FORMULÁRIO ==========
  onSubmit() {
    const formData = this.inboundData.getRawValue();
    if (formData.products.length === 0) {
      this.toast.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Adicione pelo menos um produto antes de enviar.',
      });
      return;
    }

    if (this.inboundData.valid) {
      this.stockMovementService
        .inboundProductsToStock(formData.products)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.toast.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Produtos adicionados ao estoque com sucesso.',
            });
            this.inboundData.reset();
            this.router.navigate([{ outlets: { drawer: null } }], {
              relativeTo: this.activatedRoute.root,
            });
          },
          error: () => {
            this.toast.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Ocorreu um erro ao realizar a entrada de produtos.',
            });
          },
        });
    }
  }

  // ========== IMPORTAÇÃO DE XML/NFE ==========

  importXml() {
    this.importInvoiceService.openDialog(this.inboundData.getRawValue());
  }

  onImportNFe() {
    this.importInvoiceService.onImport$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        if (data) {
          this.inboundData.patchValue({
            ...data,
            name: data.identification?.name || '',
          });
        }
      });
  }

  // ========== GERENCIAMENTO DE PRODUTOS ==========

  filterProduct(event: AutoCompleteCompleteEvent) {
    const query = event?.query;
    if (query) {
      // Simula uma chamada de API para filtrar produtos
      this.productService
        .filterProducts(query)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(response => {
          this.filteredProducts.set(response.dados || []);
        });
    } else {
      this.filteredProducts.set([]);
    }
  }

  addProductToList() {
    if (this.formAddProduct.valid) {
      const formData = this.formAddProduct.value;
      const selectedProduct = formData.productId as unknown as Product; // Este agora será o objeto produto completo
      const quantity = formData.quantity as number;

      if (!selectedProduct || !quantity) {
        return;
      }

      const products = this.inboundData.get('products')?.value || [];
      const existingProductIndex = products.findIndex(
        (p: any) => p.sku === selectedProduct.sku
      );

      if (existingProductIndex > -1) {
        products[existingProductIndex].quantity += quantity;
      } else {
        products.push({
          ...selectedProduct,
          quantity,
          stock: selectedProduct?.stock?.quantity,
        });
      }

      this.inboundData.patchValue({ products });
      this.showSelectProductDialog.set(false);
      this.formAddProduct.reset();
    }
  }

  removeProduct(productId: string) {
    const products = this.inboundData.get('products')?.value || [];
    const updatedProducts = products.filter((p: any) => p.id !== productId);
    this.inboundData.patchValue({ products: updatedProducts });
  }

  // ========== GERENCIAMENTO DE DIALOGS ==========

  closeDialog(e = new Event('close')): void {
    this.dialogRef.close(e);
  }

  onCloseDialog() {
    this.visible.set(false);
    setTimeout(() => {
      this.router.navigate([{ outlets: { drawer: null } }], {
        relativeTo: this.activatedRoute.root,
      });
    }, 300);
  }
}
