import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { CoreService } from 'app/shared/services/core.service';
import { TabsModule } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { FormModule } from 'app/shared/components/form/form.module';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ImportInvoiceComponent } from 'app/shared/components/import-invoice/import-invoice.component';
import { ImportInvoiceService } from 'app/shared/components/import-invoice/import-invoice.service';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { Dialog, DialogModule } from 'primeng/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TableComponent } from 'app/shared/components/table/table.component';
import {
  DEFAULT_TABLE_CONFIG,
  TableConfig,
} from 'app/shared/interfaces/table.interfaces';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchProductComponent } from 'app/shared/components/search-product/search-product.component';
import { CurrencyPipe } from '@angular/common';
import { ProductService } from 'app/dashboard/modules/product-module/product.service';

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
    SearchProductComponent,
    DialogModule,
    AutoCompleteModule,
    CurrencyPipe
  ],
})
export class InboundComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private coreService = inject(CoreService);
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
    quantity: [1, [Validators.required, Validators.min(1)]]
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
        { field: 'description', caption: 'Nome' },
        { field: 'sku', caption: 'SKU' },
        { field: 'ean', caption: 'EAN' },
        { field: 'ncm', caption: 'NCM' },
        { field: 'quantity', caption: 'Quantidade', sortable: true },
        { field: 'unitValue', caption: 'Valor Unitário', sortable: true },
        { field: 'totalValue', caption: 'Valor Total', sortable: true },
      ],
    });
  }

  onSubmit() {
    console.log('Form submitted:', this.inboundData.value);
  }

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
          });
        }
      });
  }

  filterProduct(event: AutoCompleteCompleteEvent) {
    const query = event?.query;
    if (query) {
      // Simula uma chamada de API para filtrar produtos
      this.productService
        .filterProducts(query)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(response => {
          this.filteredProducts.set(response.data || []);
        });
    } else {
      this.filteredProducts.set([]);
    }
  }

  addProduct() {
    if (this.formAddProduct.valid) {
      const productData = this.formAddProduct.value;
      const products = this.inboundData.get('products')?.value || [];
      const existingProductIndex = products.findIndex(
        (p: any) => p.productId === productData.productId
      );
      if (existingProductIndex > -1) {
        // Atualiza a quantidade se o produto já existir
        products[existingProductIndex].quantity += productData.quantity;
      } else {
        products.push(productData);
      }
    }
    this.formAddProduct.reset();
  }

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
