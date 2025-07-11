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
import { Dialog, DialogModule } from 'primeng/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TableComponent } from 'app/shared/components/table/table.component';
import {
  DEFAULT_TABLE_CONFIG,
  TableConfig,
} from 'app/shared/interfaces/table.interfaces';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchProductComponent } from "app/shared/components/search-product/search-product.component";

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
  ],
})
export class InboundComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private coreService = inject(CoreService);

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

  tableConfig = signal<TableConfig>(DEFAULT_TABLE_CONFIG);

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
      showHeader: false,
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
