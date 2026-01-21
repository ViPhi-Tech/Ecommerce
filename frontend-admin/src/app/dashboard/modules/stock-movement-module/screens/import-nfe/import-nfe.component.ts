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
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'fuse-import-nfe',
  templateUrl: './import-nfe.component.html',
  styleUrls: ['./import-nfe.component.scss'],
  imports: [
    DialogModule,
    FileUploadComponent,
    InvoiceDetailsComponent,
    ButtonModule,
    CurrencyPipe,
    DatePipe,
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
      const file = files[0];
      
      // Validar se é arquivo XML
      if (!file.name.toLowerCase().endsWith('.xml') && !file.type.includes('xml')) {
        this.toast.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Por favor, selecione apenas arquivos XML.',
        });
        return;
      }

      this.loadingImport.set(true);
      const reader = new FileReader();
      reader.onload = async () => {
        const xmlString = reader.result as string;
        try {
          // Converte XML para JSON bruto
          const json = await XmlUtils.xmlToJson(xmlString);
          this.nfeJson.set(json);

          // Formata os dados para exibição bonita (opcional, não necessário para salvar)
          // Não precisa validar produtos, pois serão criados automaticamente pelo backend
          try {
            const nfModel =
              json?.NFe?.infNFe?.ide?.mod ||
              json?.nfeProc?.NFe?.infNFe?.ide?.mod ||
              '55';
            // Formata sem validação de produtos - apenas para visualização
            const formatted = XmlUtils.beautifyNFe(json, nfModel, []);
            this.nfeFormatted.set(formatted);
          } catch (formatError) {
            console.warn('Erro ao formatar NFe para exibição:', formatError);
            // Continua mesmo se não conseguir formatar
          }

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

  getTotalQuantity(): number {
    const nfeFormatted = this.nfeFormatted();
    if (!nfeFormatted || !nfeFormatted.products) {
      return 0;
    }
    
    return nfeFormatted.products.reduce((total: number, product: any) => {
      const quantity = typeof product.quantity === 'string' 
        ? parseFloat(product.quantity) 
        : product.quantity || 0;
      return total + quantity;
    }, 0);
  }

  async savePurchaseInvoice() {
    console.log('savePurchaseInvoice chamado');
    const nfeJson = this.nfeJson();
    
    if (!nfeJson) {
      this.toast.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Não há nota fiscal para salvar.',
      });
      return;
    }

    console.log('Enviando nota fiscal para o backend:', nfeJson);
    this.loadingSend.set(true);

    // Envia o JSON completo da NFe para o backend
    this.stockMovementService
      .createPurchaseInvoice(nfeJson)
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe({
        next: (response) => {
          console.log('Resposta do backend:', response);
          this.stockMovementService.refreshStockData();
          this.toast.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: response?.data?.descricao || response?.data?.dados?.descricao || 'Nota fiscal salva com sucesso!',
          });
          this.loadingSend.set(false);
          // Fechar o diálogo após sucesso
          this.onCloseDialog();
        },
        error: (error) => {
          console.error('Erro ao salvar nota fiscal:', error);
          const errorMessage = error?.error?.descricao || error?.error?.message || error?.message || 'Ocorreu um erro ao salvar a nota fiscal.';
          this.toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: errorMessage,
          });
          this.loadingSend.set(false);
        },
      });
  }
}
