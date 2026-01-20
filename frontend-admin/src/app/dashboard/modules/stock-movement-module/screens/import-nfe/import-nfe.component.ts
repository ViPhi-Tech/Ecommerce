import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CoreService } from 'app/shared/services/core.service';
import { MessageService } from 'primeng/api';
import { Dialog, DialogModule } from 'primeng/dialog';
import { FileUploadComponent } from 'app/shared/components/file-upload/file-upload.component';
import { XmlUtils } from 'app/shared/utils/xml.utils';
import { InvoiceDetailsComponent } from 'app/shared/components/invoice-details/invoice-details.component';
import { ProductState } from 'app/dashboard/modules/product-module/product.state';
import { InvoiceDetails } from 'app/shared/interfaces/invoice/InvoiceDetails';
import { ButtonModule } from 'primeng/button';
import { StockMovementService } from '../../stock-movement.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IProduct } from 'app/shared/interfaces/product/Product';

@Component({
  selector: 'fuse-import-nfe',
  templateUrl: './import-nfe.component.html',
  styleUrls: ['./import-nfe.component.scss'],
  imports: [
    DialogModule,
    FileUploadComponent,
    InvoiceDetailsComponent,
    ButtonModule,
  ],
})
export class ImportNfeComponent implements OnInit {
  @ViewChild('dialogRef') dialogRef!: Dialog;
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private coreService = inject(CoreService);
  private toast = inject(MessageService);
  private destroyedRef = inject(DestroyRef);
  private productState = inject(ProductState);
  private stockMovementService = inject(StockMovementService);

  // signals
  visible = signal(true);
  title = signal('Importar Nota Fiscal');
  subtitle = signal(
    'Faça upload de um arquivo XML de nota fiscal eletrônica (NF-e) para converter em JSON'
  );
  loadingImport = signal(false);
  loadingSend = signal(false);
  nfeJson = signal<any>(null);
  nfeFormatted = signal<InvoiceDetails | null>(null);
  showJsonView = signal(false);

  constructor() {}

  ngOnInit() {
    this.coreService.setPageTitle(
      'Importar Nota Fiscal',
      'Importação de nota fiscal eletrônica'
    );
  }

  onCloseDialog() {
    this.visible.set(false);
    this.router.navigate([{ outlets: { drawer: null } }]);
  }

  async onUploadNFe(files: any) {
    if (files?.length) {
      this.loadingImport.set(true);
      const file = files[0];
      const reader = new FileReader();
      reader.onload = async () => {
        const xmlString = reader.result as string;
        try {
          // Converte XML para JSON bruto
          const json = await XmlUtils.xmlToJson(xmlString);
          this.nfeJson.set(json);

          // Formata os dados para exibição bonita
          await this.productState.getProductList();
          const products = this.productState.productList();
          const nfModel =
            json?.NFe?.infNFe?.ide?.mod ||
            json?.nfeProc?.NFe?.infNFe?.ide?.mod ||
            '55';
          const formatted = XmlUtils.beautifyNFe(json, nfModel, products);
          this.nfeFormatted.set(formatted);

          this.toast.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Nota fiscal convertida com sucesso!',
          });
        } catch (error) {
          console.error('Erro ao converter XML:', error);
          this.toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao converter XML da nota fiscal',
          });
        } finally {
          this.loadingImport.set(false);
        }
      };
      reader.readAsText(file);
    }
  }

  toggleJsonView() {
    this.showJsonView.update(value => !value);
  }

  getFormattedJson(): string {
    return JSON.stringify(this.nfeJson(), null, 2);
  }

  async copyJsonToClipboard() {
    try {
      const jsonString = this.getFormattedJson();
      await navigator.clipboard.writeText(jsonString);
      this.toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'JSON copiado para a área de transferência!',
      });
    } catch (error) {
      console.error('Erro ao copiar JSON:', error);
      this.toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao copiar JSON',
      });
    }
  }

  removeProduct(itemNumber: string) {
    const nfeFormatted = this.nfeFormatted();
    if (!nfeFormatted || !nfeFormatted.products) {
      return;
    }
    
    const updatedProducts = nfeFormatted.products.filter(
      (p: any) => p.itemNumber !== itemNumber
    );
    
    this.nfeFormatted.set({
      ...nfeFormatted,
      products: updatedProducts,
    });
  }

  async sendToBackend() {
    const nfeFormatted = this.nfeFormatted();
    if (!nfeFormatted || !nfeFormatted.products || nfeFormatted.products.length === 0) {
      this.toast.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Não há produtos para enviar.',
      });
      return;
    }

    this.loadingSend.set(true);

    try {
      // Busca produtos correspondentes na lista de produtos do sistema
      const products = this.productState.productList();
      const productsToSend: IProduct[] = [];

      for (const nfeProduct of nfeFormatted.products) {
        // Tenta encontrar o produto por SKU ou EAN
        const foundProduct = products.find(
          (p) =>
            p.sku === nfeProduct.sku ||
            p.ean === nfeProduct.ean ||
            p.ean === nfeProduct.eanTrib
        );

        if (foundProduct) {
          // Converte a quantidade da NFe para número
          const quantity = typeof nfeProduct.quantity === 'string'
            ? parseFloat(nfeProduct.quantity)
            : nfeProduct.quantity;

          productsToSend.push({
            ...foundProduct,
            quantity: quantity,
          });
        } else {
          console.warn(`Produto não encontrado no sistema: ${nfeProduct.description} (SKU: ${nfeProduct.sku}, EAN: ${nfeProduct.ean})`);
        }
      }

      if (productsToSend.length === 0) {
        this.toast.add({
          severity: 'warn',
          summary: 'Atenção',
          detail: 'Nenhum produto da nota fiscal foi encontrado no sistema.',
        });
        this.loadingSend.set(false);
        return;
      }

      // Envia para o backend
      this.stockMovementService
        .updateProductStock(productsToSend, 'IN')
        .pipe(takeUntilDestroyed(this.destroyedRef))
        .subscribe({
          next: () => {
            this.stockMovementService.refreshStockData();
            this.toast.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Produtos enviados ao backend com sucesso!',
            });
            this.loadingSend.set(false);
            // Opcional: fechar o diálogo após sucesso
            // this.onCloseDialog();
          },
          error: (error) => {
            console.error('Erro ao enviar produtos:', error);
            this.toast.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Ocorreu um erro ao enviar os produtos ao backend.',
            });
            this.loadingSend.set(false);
          },
        });
    } catch (error) {
      console.error('Erro ao processar envio:', error);
      this.toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao processar os dados para envio.',
      });
      this.loadingSend.set(false);
    }
  }
}
