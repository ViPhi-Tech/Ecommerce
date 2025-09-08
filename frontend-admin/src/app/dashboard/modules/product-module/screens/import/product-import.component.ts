import {
  Component,
  OnInit,
  signal,
  ViewChild,
  inject,
  DestroyRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Dialog, DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { convertFileToJson, generateXlsxFile } from 'app/shared/utils/utils';
import { ProductImportListComponent } from './product-import-list/product-import-list.component';
import { CategoryState } from 'app/dashboard/modules/category-module/category.state';
import { ProductService } from '../../product.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'fuse-product-import',
  templateUrl: './product-import.component.html',
  styleUrls: ['./product-import.component.scss'],
  imports: [
    DialogModule,
    ButtonModule,
    FileUploadModule,
    ProductImportListComponent,
  ],
})
export class ProductImportComponent implements OnInit {
  destroyedRef = inject(DestroyRef);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private toast = inject(MessageService);
  private productService = inject(ProductService);
  private categoryState = inject(CategoryState);

  xlsxBase = [
    {
      'Nome do Produto': 'Smartphone Galaxy S22 Ultra',
      Ean: '7891234567890',
      'Código/SKU': 'SM-S22U-256GB-BLK',
      Categoria: 'Eletrônicos',
      'Marca / Fabricante': 'Samsung',
      'Preço de custo': 2500.0,
      'Preço de venda': 3000.0,
      'Estoque inicial': 10,
      'Descrição curta': 'Breve descrição do produto',
      Descrição: 'Descrição detalhada do produto',
    },
  ];

  @ViewChild('dialogRef') dialogRef!: Dialog;

  // signals
  visible = signal(false);
  selectedFile: File | null = null;
  convertedProducts = signal<any[]>([]);
  importValidationErrors = signal<any>(null);

  constructor() {}

  async ngOnInit() {
    await this.categoryState.getCategoryList(false);
    this.visible.set(true);
  }

  onFileSelected(event: FileSelectEvent): void {
    this.selectedFile = event.currentFiles[0];

    if (!this.selectedFile) {
      this.toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, selecione um arquivo para importar.',
      });
      return;
    }

    // Converter o arquivo para JSON
    convertFileToJson(this.selectedFile)
      .then(jsonData => {
        const converted = this.convertFields(jsonData);
        this.productService
          .validateImportProducts(converted)
          .pipe(takeUntilDestroyed(this.destroyedRef))
          .subscribe({
            next: response => {
              this.convertedProducts.set(converted);
              this.importValidationErrors.set(response.data);
              console.log(this.importValidationErrors());
            },
          });
      })
      .catch(error => {
        console.error('Erro ao converter arquivo:', error);
      });
  }

  downloadProductsTemplate(): void {
    generateXlsxFile(
      [
        {
          data: this.xlsxBase,
          sheetName: 'Produtos',
          mandatoryColumns: [
            'Nome do Produto',
            'EAN',
            'SKU',
            'Categoria',
            'Marca',
            'Preço Custo',
            'Preço Venda',
            'Estoque',
            'Descrição Curta',
            'Descrição',
          ],
        },
        { data: this.categoryState.categoryList(), sheetName: 'Categorias' },
      ],
      'produtos.xlsx'
    );

    this.toast.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Arquivo de exemplo gerado com sucesso!',
    });
  }

  convertFields(data: any[]): any[] {
    const fieldsMapper = {
      'Nome do Produto': 'name',
      Ean: 'ean',
      'Código/SKU': 'sku',
      Categoria: 'categoryId',
      'Marca / Fabricante': 'brand',
      'Preço de custo': 'initialPrice',
      'Preço de venda': 'finalPrice',
      'Estoque inicial': 'quantity',
      'Descrição curta': 'shortDescription',
      Descrição: 'description',
    };

    return data.map(item => {
      const convertedItem: any = {};
      for (const [key, value] of Object.entries(fieldsMapper)) {
        convertedItem[value] = item[key];
      }
      return convertedItem;
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
