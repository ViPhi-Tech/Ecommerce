import {
  Component,
  inject,
  OnInit,
  signal,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Dialog, DialogModule } from 'primeng/dialog';
import { FormModule } from 'app/shared/components/form/form.module';
import { FileUploadModule } from 'primeng/fileupload';
import { XmlUtils } from 'app/shared/utils/xml.utils';
import { InvoiceDetailsComponent } from 'app/shared/components/invoice-details/invoice-details.component';
import { FileUploadComponent } from 'app/shared/components/file-upload/file-upload.component';
import { Subscription } from 'rxjs';
import { InvoiceDetails } from 'app/shared/interfaces/invoice.interface';
import { ImportInvoiceService } from './import-invoice.service';
import { ProductState } from 'app/dashboard/modules/product-module/product.state';

@Component({
  selector: 'fuse-import-invoice',
  templateUrl: './import-invoice.component.html',
  styleUrls: ['./import-invoice.component.scss'],
  imports: [
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    FormModule,
    FileUploadModule,
    InvoiceDetailsComponent,
    FileUploadComponent,
  ],
})
export class ImportInvoiceComponent implements OnInit, OnDestroy {
  private importInvoiceService = inject(ImportInvoiceService);
  private formBuilder = inject(FormBuilder);
  private productState = inject(ProductState);

  @ViewChild('dialogRef') dialogRef!: Dialog;

  formGroup = this.formBuilder.group({});

  // signals
  visible = signal(false);
  title = signal('Importar Nota Fiscal');
  subtitle = signal(
    'Você pode importar uma nota fiscal eletrônica (NF-e) através do arquivo XML.'
  );
  nfModel = signal('55');

  uploadedFiles: any[] = [];
  loading = signal(false);
  invoice = signal<InvoiceDetails | undefined>(undefined);

  private _importSubscription: Subscription | undefined;

  constructor() {}

  ngOnInit(): void {
    this.importInvoiceService.openDialog$.subscribe(data => {
      this.openDialog(data);
    });
  }

  onUpload(files: any) {
    if (files?.length) {
      this.loading.set(true);
      const file = files[0];
      const reader = new FileReader();
      reader.onload = async () => {
        const xmlString = reader.result as string;
        try {
          let invoice = await XmlUtils.xmlToJson(xmlString);
          await this.productState.getProductList();
          const products = this.productState.productList();
          invoice = XmlUtils.beautifyNFe(invoice, this.nfModel(), products);
          this.invoice.set(invoice);
          this.loading.set(false);
        } catch (error) {
          console.error('Erro ao converter XML:', error);
          this.loading.set(false);
        }
      };

      reader.readAsText(file);
    }
  }

  import() {
    if (this.invoice()) {
      this.importInvoiceService.importInvoices(this.invoice());
      this.closeDialog();
      this.invoice.set(undefined);
      this.uploadedFiles = [];
    } else {
      console.warn('Nenhuma nota fiscal para importar.');
    }
  }

  openDialog(data: any) {
    this.visible.set(true);
    this.nfModel.set(data.nfModel || '55');
  }

  closeDialog(e = new Event('close')): void {
    this.dialogRef.close(e);
  }

  onCloseDialog() {
    this.visible.set(false);
    this.invoice.set(undefined);
    this.uploadedFiles = [];
  }

  ngOnDestroy(): void {
    this._importSubscription?.unsubscribe();
  }
}
