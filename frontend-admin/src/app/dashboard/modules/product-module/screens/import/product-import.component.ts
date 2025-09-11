import {
  Component,
  OnInit,
  signal,
  ViewChild,
  inject,
  DestroyRef,
  computed,
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
import { ProductState } from '../../product.state';

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
  private productState = inject(ProductState);
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
  currentProducts = computed(() => this.productState.productList());
  currentCategories = computed(() => this.categoryState.categoryList());

  visible = signal(false);
  selectedFile: File | null = null;
  convertedProducts = signal<any[]>([]);
  importValidationErrors = signal<any>(null);

  constructor() {}

  async ngOnInit() {
    if (!this.categoryState.categoryList().length) {
      await this.categoryState.getCategoryList(false);
    }
    if (!this.productState.productList().length) {
      await this.productState.getProductList(false);
    }

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

        // Validar dados
        this.importValidationErrors.set(this.validateProducts(converted));
        this.convertedProducts.set(converted);
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

  validateProducts(products: any[]): any {
    const errors: any = {
      skuExisting: [] as string[],
      eanExisting: [] as string[],
      categoryInvalid: [] as number[],
    };

    products.forEach(product => {
      const duplicateSKU = products.filter(
        prod => prod.sku === product.sku
      ).length;
      const duplicateEAN = products.filter(
        prod => prod.ean === product.ean
      ).length;
      const eanExists = this.currentProducts()?.some(
        prod => prod.ean === product.ean
      );
      const skuExists = this.currentProducts()?.some(
        prod => prod.sku === product.sku
      );

      if (
        !this.currentCategories().some(cat => cat.id === product.categoryId)
      ) {
        errors.categoryInvalid.push(product.categoryId);
      }
      if (duplicateSKU > 1 || eanExists) {
        errors.skuExisting.push(product.sku);
      }
      if (duplicateEAN > 1 || skuExists) {
        errors.eanExisting.push(product.ean);
      }
    });

    return errors;
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
